const {assert, config} = require("chai");
config.truncateThreshold = 0;

describe("Basic Cases", () => {
  it("should be true for 'Dermatoglyphics'", () => {
    assert.strictEqual(isIsogram("Dermatoglyphics"), true);
  });

  it("should be false for 'moose'", () => {
    assert.strictEqual(isIsogram("moose"), false);
  });

  it("should handle non-adjacent letters", () => {
    assert.strictEqual(isIsogram("aba"), false);
  });
});

describe("Edge Cases", () => {
  it("should ignore case", () => {
    assert.strictEqual(isIsogram("moOse"), false);
  });

  it("should handle empty strings", () => {
    assert.strictEqual(isIsogram(""), true);
  });
});