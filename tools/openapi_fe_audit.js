#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "reports", "openapi_fe_audit.md");
const GENERATED_API_PATH = path.join(ROOT, "src", "generated", "api.ts");

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "options", "head"]);

function findOpenApiFile() {
  const candidates = [
    path.join(ROOT, "openapi.yaml"),
    path.join(ROOT, "api", "openapi.yaml"),
    path.join(ROOT, "openapi", "openapi.yaml"),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function parseInlineArray(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return null;
  }
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) {
    return [];
  }
  return inner
    .split(",")
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
}

function parseOpenApiOperations(content) {
  const lines = content.split(/\r?\n/);
  const operations = [];
  let inPaths = false;
  let currentPath = null;
  let currentMethod = null;
  let currentOp = null;
  let inTags = false;
  let inSecurity = false;
  let inResponses = false;

  const pushCurrent = () => {
    if (currentOp) {
      operations.push(currentOp);
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith("#")) {
      continue;
    }
    const indent = raw.match(/^\s*/)[0].length;
    const trimmed = raw.trim();

    if (!inPaths) {
      if (trimmed === "paths:") {
        inPaths = true;
      }
      continue;
    }

    if (inPaths && indent === 0) {
      break;
    }

    if (indent === 2 && trimmed.endsWith(":")) {
      const pathValue = trimmed.slice(0, -1);
      if (pathValue.startsWith("/")) {
        if (currentOp) {
          pushCurrent();
        }
        currentPath = pathValue;
        currentMethod = null;
        currentOp = null;
        inTags = false;
        inSecurity = false;
        inResponses = false;
      }
      continue;
    }

    if (indent === 4 && trimmed.endsWith(":")) {
      const methodCandidate = trimmed.slice(0, -1);
      if (HTTP_METHODS.has(methodCandidate)) {
        if (currentOp) {
          pushCurrent();
        }
        currentMethod = methodCandidate;
        currentOp = {
          path: currentPath,
          method: currentMethod,
          summary: null,
          operationId: null,
          tags: [],
          security: null,
          hasRequestBody: false,
          responses: [],
          hasPathParams: currentPath ? currentPath.includes("{") : false,
        };
        inTags = false;
        inSecurity = false;
        inResponses = false;
      }
      continue;
    }

    if (!currentOp) {
      continue;
    }

    if (indent <= 4) {
      inTags = false;
      inSecurity = false;
      inResponses = false;
    }

    if (indent === 6 && trimmed.startsWith("summary:")) {
      currentOp.summary = stripQuotes(trimmed.replace("summary:", "").trim());
      continue;
    }

    if (indent === 6 && trimmed.startsWith("operationId:")) {
      currentOp.operationId = stripQuotes(trimmed.replace("operationId:", "").trim());
      continue;
    }

    if (indent === 6 && trimmed.startsWith("tags:")) {
      const inline = trimmed.replace("tags:", "").trim();
      const parsed = inline ? parseInlineArray(inline) : null;
      if (parsed) {
        currentOp.tags = parsed;
        inTags = false;
      } else {
        inTags = true;
      }
      continue;
    }

    if (inTags && indent >= 8 && trimmed.startsWith("- ")) {
      currentOp.tags.push(stripQuotes(trimmed.slice(2).trim()));
      continue;
    }

    if (indent === 6 && trimmed.startsWith("security:")) {
      const inline = trimmed.replace("security:", "").trim();
      if (inline === "[]") {
        currentOp.security = [];
        inSecurity = false;
      } else {
        inSecurity = true;
      }
      continue;
    }

    if (inSecurity && indent >= 8 && trimmed.startsWith("- ")) {
      currentOp.security = currentOp.security || [];
      currentOp.security.push(trimmed.slice(2).trim());
      continue;
    }

    if (indent === 6 && trimmed.startsWith("requestBody:")) {
      currentOp.hasRequestBody = true;
      continue;
    }

    if (indent === 6 && trimmed.startsWith("responses:")) {
      inResponses = true;
      continue;
    }

    if (inResponses && indent >= 8 && /^['"]?\d{3}['"]?:/.test(trimmed)) {
      const status = trimmed.split(":")[0].replace(/['"]/g, "");
      if (!currentOp.responses.includes(status)) {
        currentOp.responses.push(status);
      }
      continue;
    }

    if (inResponses && indent <= 6) {
      inResponses = false;
    }
  }

  if (currentOp) {
    pushCurrent();
  }

  return operations;
}

function extractGeneratedOperations() {
  if (!fs.existsSync(GENERATED_API_PATH)) {
    return new Map();
  }
  const content = fs.readFileSync(GENERATED_API_PATH, "utf8");
  const regex = /export const (get(?:Get|Post|Put|Patch|Delete)[A-Za-z0-9_]+)Url\s*=\s*\([^)]*\)\s*=>\s*{\s*return `([^`]+)`/g;
  const operations = new Map();
  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    const url = match[2].replace(/\$\{([^}]+)\}/g, "{$1}");
    const methodMatch = name.match(/^get(Get|Post|Put|Patch|Delete)(.+)$/);
    if (!methodMatch) {
      continue;
    }
    const method = methodMatch[1].toLowerCase();
    const baseName = methodMatch[2];
    const functionName = `${method}${baseName}`;
    const key = `${method.toUpperCase()} ${url}`;
    operations.set(key, { method, path: url, functionName });
  }
  return operations;
}

function collectSourceFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) {
        continue;
      }
      files.push(...collectSourceFiles(fullPath));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function findUsages(functionNames) {
  const sources = [path.join(ROOT, "src"), path.join(ROOT, "app")]
    .filter((dir) => fs.existsSync(dir));
  const files = sources.flatMap(collectSourceFiles).filter((file) =>
    !file.endsWith(path.join("src", "generated", "api.ts"))
  );

  const usage = new Map();
  functionNames.forEach((name) => usage.set(name, []));

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    functionNames.forEach((name) => {
      if (content.includes(name)) {
        usage.get(name).push(path.relative(ROOT, file));
      }
    });
  }

  return usage;
}

function findManualFetchCalls() {
  const sources = [path.join(ROOT, "src"), path.join(ROOT, "app")]
    .filter((dir) => fs.existsSync(dir));
  const files = sources.flatMap(collectSourceFiles).filter((file) =>
    !file.endsWith(path.join("src", "generated", "api.ts")) &&
    !file.endsWith(path.join("src", "lib", "http.ts"))
  );

  const hits = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    if (/\bfetch\s*\(/.test(content) || /\baxios\b/.test(content)) {
      hits.push(path.relative(ROOT, file));
    }
  }
  return hits;
}

function renderReport({ openapiPath, operations, results, tagStats, manualCalls }) {
  const totals = results.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, OK: 0, CLIENT_ONLY: 0, MISSING_CLIENT: 0, PARTIAL: 0, NO_UI_JUSTIFIED: 0 }
  );

  const lines = [];
  lines.push(`# FE <-> OpenAPI Audit`);
  lines.push("");
  lines.push(`Spec: \`${path.relative(ROOT, openapiPath)}\``);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Total operations: ${totals.total}`);
  lines.push(`- OK: ${totals.OK}`);
  lines.push(`- CLIENT_ONLY: ${totals.CLIENT_ONLY}`);
  lines.push(`- MISSING_CLIENT: ${totals.MISSING_CLIENT}`);
  if (totals.PARTIAL) {
    lines.push(`- PARTIAL: ${totals.PARTIAL}`);
  }
  if (totals.NO_UI_JUSTIFIED) {
    lines.push(`- NO_UI_JUSTIFIED: ${totals.NO_UI_JUSTIFIED}`);
  }
  lines.push("");

  lines.push("## By Tag");
  lines.push("");
  lines.push("| Tag | Total | OK | CLIENT_ONLY | MISSING_CLIENT | PARTIAL | NO_UI_JUSTIFIED |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  Object.keys(tagStats)
    .sort()
    .forEach((tag) => {
      const stats = tagStats[tag];
      lines.push(
        `| ${tag} | ${stats.total} | ${stats.OK ?? 0} | ${stats.CLIENT_ONLY ?? 0} | ${
          stats.MISSING_CLIENT ?? 0
        } | ${stats.PARTIAL ?? 0} | ${stats.NO_UI_JUSTIFIED ?? 0} |`
      );
    });
  lines.push("");

  const nonOk = results.filter((item) => item.status !== "OK");
  lines.push("## Non-OK Operations");
  lines.push("");
  if (nonOk.length === 0) {
    lines.push("All operations are consumed by the frontend.");
  } else {
    nonOk.forEach((item) => {
      lines.push(`### ${item.method.toUpperCase()} ${item.path}`);
      lines.push("");
      lines.push(`- Status: ${item.status}`);
      if (item.summary) {
        lines.push(`- Summary: ${item.summary}`);
      }
      if (item.tags && item.tags.length > 0) {
        lines.push(`- Tags: ${item.tags.join(", ")}`);
      }
      lines.push(`- Client: ${item.clientFunction ?? "MISSING"}`);
      if (item.usage && item.usage.length > 0) {
        lines.push(`- Usage: ${item.usage.join(", ")}`);
      }
      if (item.note) {
        lines.push(`- Note: ${item.note}`);
      }
      lines.push("");
    });
  }

  lines.push("## Manual HTTP Calls");
  lines.push("");
  if (manualCalls.length === 0) {
    lines.push("No manual fetch/axios calls detected outside the generated client.");
  } else {
    manualCalls.forEach((file) => lines.push(`- ${file}`));
  }

  lines.push("");
  return lines.join("\n");
}

function loadOverrides() {
  const overridePath = path.join(ROOT, "tools", "openapi_fe_audit.overrides.json");
  if (!fs.existsSync(overridePath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(overridePath, "utf8"));
  } catch {
    return {};
  }
}

function run(mode) {
  const openapiPath = findOpenApiFile();
  if (!openapiPath) {
    console.error("openapi.yaml not found.");
    process.exit(1);
  }

  if (mode === "fix") {
    execSync("pnpm generate:api", { stdio: "inherit" });
  }

  const spec = fs.readFileSync(openapiPath, "utf8");
  const operations = parseOpenApiOperations(spec);
  const generatedOps = extractGeneratedOperations();
  const functionNames = Array.from(generatedOps.values()).map((item) => item.functionName);
  const usageMap = findUsages(functionNames);
  const overrides = loadOverrides();

  const results = operations.map((op) => {
    const key = `${op.method.toUpperCase()} ${op.path}`;
    const generated = generatedOps.get(key);
    const override = overrides[key];

    if (override) {
      return {
        ...op,
        status: override.status,
        note: override.note || null,
        clientFunction: generated?.functionName ?? null,
        usage: generated ? usageMap.get(generated.functionName) ?? [] : [],
      };
    }

    if (!generated) {
      return {
        ...op,
        status: "MISSING_CLIENT",
        clientFunction: null,
        usage: [],
      };
    }

    const usage = usageMap.get(generated.functionName) ?? [];
    if (usage.length === 0) {
      return {
        ...op,
        status: "CLIENT_ONLY",
        clientFunction: generated.functionName,
        usage,
      };
    }

    return {
      ...op,
      status: "OK",
      clientFunction: generated.functionName,
      usage,
    };
  });

  const tagStats = {};
  results.forEach((item) => {
    const tags = item.tags && item.tags.length > 0 ? item.tags : ["untagged"];
    tags.forEach((tag) => {
      if (!tagStats[tag]) {
        tagStats[tag] = { total: 0 };
      }
      tagStats[tag].total += 1;
      tagStats[tag][item.status] = (tagStats[tag][item.status] ?? 0) + 1;
    });
  });

  const manualCalls = findManualFetchCalls();
  const report = renderReport({ openapiPath, operations, results, tagStats, manualCalls });
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, "utf8");

  const hasBlocking = results.some((item) =>
    ["MISSING_CLIENT", "CLIENT_ONLY", "PARTIAL"].includes(item.status)
  );

  if (hasBlocking) {
    console.error("OpenAPI FE audit failed: missing or unused operations detected.");
    process.exit(1);
  }
  process.exit(0);
}

const mode = process.argv[2] || "audit";
run(mode);
