import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeListResponse } from "./normalizeListResponse";

describe("normalizeListResponse", () => {
  it("handles direct array", () => {
    const result = normalizeListResponse("demo", [{ id: 1 }]);
    assert.equal(result.meta.pattern, "array");
    assert.equal(result.meta.length, 1);
    assert.equal(result.meta.parsedJson, false);
  });

  it("handles { items: [] }", () => {
    const result = normalizeListResponse("demo", { items: [{ id: 1 }] });
    assert.equal(result.meta.pattern, "obj.items");
    assert.equal(result.meta.length, 1);
    assert.equal(result.meta.parsedJson, false);
  });

  it("handles { data: [] }", () => {
    const result = normalizeListResponse("demo", { data: [{ id: 1 }] });
    assert.equal(result.meta.pattern, "obj.data");
    assert.equal(result.meta.length, 1);
    assert.equal(result.meta.parsedJson, false);
  });

  it("handles { data: { items: [] } }", () => {
    const result = normalizeListResponse("demo", { data: { items: [{ id: 1 }] } });
    assert.equal(result.meta.pattern, "obj.data.items");
    assert.equal(result.meta.length, 1);
    assert.equal(result.meta.parsedJson, false);
  });

  it("handles JSON string arrays", () => {
    const result = normalizeListResponse("demo", '[{"id":1}]');
    assert.equal(result.meta.pattern, "array");
    assert.equal(result.meta.length, 1);
    assert.equal(result.meta.parsedJson, true);
  });

  it("handles JSON string objects with items", () => {
    const result = normalizeListResponse("demo", '{ "items": [{"id":1}] }');
    assert.equal(result.meta.pattern, "obj.items");
    assert.equal(result.meta.length, 1);
    assert.equal(result.meta.parsedJson, true);
  });

  it("handles null", () => {
    const result = normalizeListResponse("demo", null);
    assert.equal(result.meta.pattern, "nullish");
    assert.equal(result.meta.length, 0);
  });

  it("handles unknown object without single-object option", () => {
    const result = normalizeListResponse("demo", { foo: "bar" });
    assert.equal(result.meta.pattern, "obj.unknown");
    assert.equal(result.meta.length, 0);
  });

  it("handles unknown object with single-object option", () => {
    const result = normalizeListResponse("demo", { foo: "bar" }, {
      acceptSingleObjectAsItem: true,
    });
    assert.equal(result.meta.pattern, "single.object");
    assert.equal(result.meta.length, 1);
  });
});
