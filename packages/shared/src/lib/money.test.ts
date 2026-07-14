import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  formatCents,
  parseCents,
  parseDecimalToCents,
  serializeCents,
  splitEvenly,
  splitProportional,
  sumCents,
  ZERO_CENTS,
} from "@tally/shared/money";

describe("parseDecimalToCents", () => {
  test("parses pt-BR amounts with thousands and decimal separators", () => {
    assert.equal(parseDecimalToCents("R$ 1.234,56"), 123456n);
    assert.equal(parseDecimalToCents("1.234.567,89"), 123456789n);
  });

  test("parses integers and partial decimals", () => {
    assert.equal(parseDecimalToCents("10"), 1000n);
    assert.equal(parseDecimalToCents("10,5"), 1050n);
    assert.equal(parseDecimalToCents("0,01"), 1n);
    assert.equal(parseDecimalToCents(",5"), 50n);
  });

  test("keeps the sign of the amount", () => {
    assert.equal(parseDecimalToCents("-5,50"), -550n);
    assert.equal(parseDecimalToCents("+2,00"), 200n);
  });

  test("accepts '.' as the decimal separator when configured", () => {
    assert.equal(
      parseDecimalToCents("1,234.56", { decimalSeparator: "." }),
      123456n,
    );
  });

  test("throws on empty, malformed, or over-precise input", () => {
    assert.throws(() => parseDecimalToCents(""), RangeError);
    assert.throws(() => parseDecimalToCents("abc"), RangeError);
    assert.throws(() => parseDecimalToCents("1,2,3"), RangeError);
    assert.throws(() => parseDecimalToCents("1,234"), RangeError); // 3 decimals
  });
});

describe("parseCents and serializeCents (API transport)", () => {
  test("parses digit strings, safe integers, and bigints", () => {
    assert.equal(parseCents("500000"), 500000n);
    assert.equal(parseCents("-42"), -42n);
    assert.equal(parseCents(1234), 1234n);
    assert.equal(parseCents(9_007_199_254_740_991n), 9_007_199_254_740_991n);
  });

  test("throws on non-integers and unsafe integers", () => {
    assert.throws(() => parseCents(10.5), RangeError);
    assert.throws(() => parseCents(Number.MAX_SAFE_INTEGER + 2), RangeError);
    assert.throws(() => parseCents("1.5"), RangeError);
    assert.throws(() => parseCents("abc"), RangeError);
  });

  test("round-trips through a string without losing precision", () => {
    assert.equal(serializeCents(500000n), "500000");
    assert.equal(serializeCents(-1n), "-1");
    const big = 9_007_199_254_740_993n; // beyond Number.MAX_SAFE_INTEGER
    assert.equal(parseCents(serializeCents(big)), big);
  });
});

describe("formatCents", () => {
  test("formats as BRL in pt-BR by default", () => {
    // Intl inserts a non-breaking space; normalize it for comparison.
    const normalize = (value: string) => value.replace(/\u00a0/g, " ");
    assert.equal(normalize(formatCents(123456n)), "R$ 1.234,56");
    assert.equal(normalize(formatCents(ZERO_CENTS)), "R$ 0,00");
    assert.equal(normalize(formatCents(-500n)), "-R$ 5,00");
  });

  test("honors a custom locale and currency", () => {
    assert.equal(
      formatCents(123456n, { locale: "en-US", currency: "USD" }),
      "$1,234.56",
    );
  });
});

describe("splitEvenly", () => {
  test("splits into equal parts with the remainder on the last one", () => {
    assert.deepEqual(splitEvenly(1000n, 3), [333n, 333n, 334n]);
    assert.deepEqual(splitEvenly(1000n, 4), [250n, 250n, 250n, 250n]);
    assert.deepEqual(splitEvenly(1n, 3), [0n, 0n, 1n]);
  });

  test("always sums back to the original total", () => {
    for (const [total, parts] of [
      [10000n, 3],
      [99n, 7],
      [500001n, 12],
    ] as const) {
      const parcels = splitEvenly(total, parts);
      assert.equal(parcels.length, parts);
      assert.equal(sumCents(parcels), total);
    }
  });

  test("throws on a non-positive or non-integer part count", () => {
    assert.throws(() => splitEvenly(100n, 0), RangeError);
    assert.throws(() => splitEvenly(100n, -1), RangeError);
    assert.throws(() => splitEvenly(100n, 1.5), RangeError);
  });
});

describe("splitProportional", () => {
  test("splits by weight with the remainder on the last slice", () => {
    assert.deepEqual(splitProportional(1000n, [1, 1, 1]), [333n, 333n, 334n]);
    assert.deepEqual(splitProportional(1000n, [1, 3]), [250n, 750n]);
    assert.deepEqual(splitProportional(100n, [1, 2, 3]), [16n, 33n, 51n]);
  });

  test("always sums back to the original total", () => {
    const shares = splitProportional(12345n, [2, 3, 5, 7]);
    assert.equal(sumCents(shares), 12345n);
  });

  test("accepts bigint weights and a zero weight", () => {
    assert.deepEqual(splitProportional(1000n, [0n, 1n]), [0n, 1000n]);
  });

  test("throws on empty, negative, fractional, or all-zero weights", () => {
    assert.throws(() => splitProportional(100n, []), RangeError);
    assert.throws(() => splitProportional(100n, [-1, 2]), RangeError);
    assert.throws(() => splitProportional(100n, [1.5, 2]), RangeError);
    assert.throws(() => splitProportional(100n, [0, 0]), RangeError);
  });
});

describe("sumCents", () => {
  test("sums exactly using bigint arithmetic", () => {
    assert.equal(sumCents([100n, 200n, 300n]), 600n);
    assert.equal(sumCents([]), 0n);
  });
});
