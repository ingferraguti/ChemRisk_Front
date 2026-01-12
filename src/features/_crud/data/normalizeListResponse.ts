type NormalizeOptions = {
  debug?: boolean;
  acceptSingleObjectAsItem?: boolean;
};

type NormalizeMeta = {
  entityKey: string;
  rawType: string;
  pattern: string;
  parsedJson: boolean;
  keys: string[] | null;
  length: number;
};

export type NormalizedListResponse<T = any> = {
  items: T[];
  meta: NormalizeMeta;
  warnings: string[];
  rawPreview: any;
};

const MAX_STRING_PREVIEW = 1200;
const MAX_KEYS_PREVIEW = 12;
const MAX_SAMPLE_KEYS = 4;

const getRawType = (raw: unknown): string => {
  if (raw === null) {
    return "null";
  }
  if (Array.isArray(raw)) {
    return "array";
  }
  return typeof raw;
};

const truncateString = (value: string, maxLength: number) =>
  value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;

const safeSampleValue = (value: unknown): unknown => {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return `[Array(${value.length})]`;
  }
  if (typeof value === "string") {
    return truncateString(value.trim(), 200);
  }
  if (typeof value === "object") {
    return "[Object]";
  }
  return value;
};

const createRawPreview = (raw: unknown): any => {
  if (typeof raw === "string") {
    return truncateString(raw.trim(), MAX_STRING_PREVIEW);
  }
  if (Array.isArray(raw)) {
    return {
      type: "array",
      length: raw.length,
      sample: raw.slice(0, 2).map(safeSampleValue),
    };
  }
  if (raw && typeof raw === "object") {
    const keys = Object.keys(raw as Record<string, unknown>);
    const sample: Record<string, unknown> = {};
    keys.slice(0, MAX_SAMPLE_KEYS).forEach((key) => {
      sample[key] = safeSampleValue((raw as Record<string, unknown>)[key]);
    });
    return {
      type: "object",
      keys: keys.slice(0, MAX_KEYS_PREVIEW),
      sample,
    };
  }
  return raw;
};

const dedupeWarnings = (warnings: string[]) => Array.from(new Set(warnings));

const logNormalization = (
  meta: NormalizeMeta,
  warnings: string[],
  rawPreview: any,
  debug?: boolean
) => {
  if (!debug || typeof console === "undefined") {
    return;
  }
  const keysPreview = meta.keys ? meta.keys.slice(0, MAX_KEYS_PREVIEW).join(",") : "null";
  const line = `[normalizeListResponse] entity=${meta.entityKey} rawType=${meta.rawType} pattern=${meta.pattern} parsedJson=${meta.parsedJson} keys=${keysPreview} itemsLen=${meta.length} warningsCount=${warnings.length}`;

  if (warnings.length > 0 && typeof console.groupCollapsed === "function") {
    console.groupCollapsed(line);
    console.warn(warnings);
    console.debug("rawPreview", rawPreview);
    console.groupEnd();
    return;
  }

  console.log(line);
  if (warnings.length > 0) {
    console.warn(warnings);
    console.debug("rawPreview", rawPreview);
  }
};

export function normalizeListResponse<T = any>(
  entityKey: string,
  raw: unknown,
  options: NormalizeOptions = {}
): NormalizedListResponse<T> {
  const rawType = getRawType(raw);
  const rawPreview = createRawPreview(raw);
  const warnings: string[] = [];

  const baseMeta: NormalizeMeta = {
    entityKey,
    rawType,
    pattern: "unknown",
    parsedJson: false,
    keys: null,
    length: 0,
  };

  const finalize = (result: NormalizedListResponse<T>) => {
    result.warnings = dedupeWarnings(result.warnings);
    result.meta.length = result.items.length;
    logNormalization(result.meta, result.warnings, result.rawPreview, options.debug);
    return result;
  };

  if (raw == null) {
    return finalize({
      items: [],
      meta: { ...baseMeta, pattern: "nullish" },
      warnings,
      rawPreview,
    });
  }

  if (Array.isArray(raw)) {
    return finalize({
      items: raw as T[],
      meta: { ...baseMeta, pattern: "array" },
      warnings,
      rawPreview,
    });
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        const parsedResult = normalizeListResponse<T>(entityKey, parsed, {
          ...options,
          debug: false,
        });
        return finalize({
          items: parsedResult.items,
          meta: {
            ...parsedResult.meta,
            rawType,
            parsedJson: true,
          },
          warnings: [...warnings, ...parsedResult.warnings],
          rawPreview,
        });
      } catch (error) {
        warnings.push(
          `[normalizeListResponse] entity=${entityKey} pattern=string.json.parse-failed rawType=${rawType} error=${String(
            error
          )}`
        );
        return finalize({
          items: [],
          meta: { ...baseMeta, pattern: "string.json.parse-failed" },
          warnings,
          rawPreview,
        });
      }
    }
    warnings.push(
      `[normalizeListResponse] entity=${entityKey} pattern=string.non-json rawType=${rawType} warning=raw string not json`
    );
    return finalize({
      items: [],
      meta: { ...baseMeta, pattern: "string.non-json" },
      warnings,
      rawPreview,
    });
  }

  if (raw && typeof raw === "object") {
    const record = raw as Record<string, unknown>;
    const keys = Object.keys(record);
    const metaBase = { ...baseMeta, keys };

    if (Array.isArray(record.items)) {
      return finalize({
        items: record.items as T[],
        meta: { ...metaBase, pattern: "obj.items" },
        warnings,
        rawPreview,
      });
    }
    if (Array.isArray(record.data)) {
      return finalize({
        items: record.data as T[],
        meta: { ...metaBase, pattern: "obj.data" },
        warnings,
        rawPreview,
      });
    }
    if (
      record.data &&
      typeof record.data === "object" &&
      Array.isArray((record.data as Record<string, unknown>).items)
    ) {
      return finalize({
        items: (record.data as Record<string, unknown>).items as T[],
        meta: { ...metaBase, pattern: "obj.data.items" },
        warnings,
        rawPreview,
      });
    }
    if (Array.isArray(record.results)) {
      return finalize({
        items: record.results as T[],
        meta: { ...metaBase, pattern: "obj.results" },
        warnings,
        rawPreview,
      });
    }
    if (Array.isArray(record.content)) {
      return finalize({
        items: record.content as T[],
        meta: { ...metaBase, pattern: "obj.content" },
        warnings,
        rawPreview,
      });
    }
    if (Array.isArray(record.rows)) {
      return finalize({
        items: record.rows as T[],
        meta: { ...metaBase, pattern: "obj.rows" },
        warnings,
        rawPreview,
      });
    }
    if (Array.isArray(record.value)) {
      return finalize({
        items: record.value as T[],
        meta: { ...metaBase, pattern: "obj.value" },
        warnings,
        rawPreview,
      });
    }

    if (options.acceptSingleObjectAsItem) {
      return finalize({
        items: [raw as T],
        meta: { ...metaBase, pattern: "single.object" },
        warnings,
        rawPreview,
      });
    }

    warnings.push(
      `[normalizeListResponse] entity=${entityKey} pattern=obj.unknown rawType=${rawType} keys=${keys.join(
        ","
      )}`
    );
    return finalize({
      items: [],
      meta: { ...metaBase, pattern: "obj.unknown" },
      warnings,
      rawPreview,
    });
  }

  warnings.push(
    `[normalizeListResponse] entity=${entityKey} pattern=unsupported rawType=${rawType} warning=unsupported raw type`
  );
  return finalize({
    items: [],
    meta: { ...baseMeta, pattern: "unsupported" },
    warnings,
    rawPreview,
  });
}
