import { describe, expect, it } from "vitest";
import { KNN_K } from "../constants";
import { predictClassWeighted } from "../knnClassifier";
import type { Example } from "../types";

function example(classId: number, features: number[]): Example {
  return { classId, features };
}

describe("predictClassWeighted", () => {
  it("trả xác suất 0 khi không có ví dụ", () => {
    expect(predictClassWeighted([1, 0], [])).toEqual({ 1: 0, 2: 0, 3: 0 });
  });

  it("ưu tiên class duy nhất", () => {
    const result = predictClassWeighted(
      [1, 0],
      [example(1, [1, 0]), example(1, [0.9, 0.1])]
    );
    expect(result[1]).toBeCloseTo(1, 2);
    expect(result[2]).toBeCloseTo(0, 2);
  });

  it("neighbor gần hơn thắng", () => {
    const result = predictClassWeighted(
      [1, 0],
      [example(1, [5, 5]), example(2, [1.01, 0.01])]
    );
    expect(result[2]).toBeGreaterThan(result[1]);
  });

  it("giới hạn K neighbors", () => {
    const examples = Array.from({ length: KNN_K + 3 }, (_, index) =>
      example(1, [index, 0])
    );
    examples.push(example(2, [0, 0]));
    const result = predictClassWeighted([0, 0], examples);
    expect(result[2]).toBeGreaterThan(0);
  });

  it("xác suất tổng gần bằng 1", () => {
    const result = predictClassWeighted(
      [0.5, 0.5],
      [example(1, [0, 0]), example(2, [1, 1]), example(3, [2, 2])]
    );
    const sum = result[1] + result[2] + result[3];
    expect(sum).toBeCloseTo(1, 2);
  });

  it("xử lý khoảng cách 0 với epsilon", () => {
    const result = predictClassWeighted(
      [1, 1],
      [example(1, [1, 1]), example(2, [1, 1])]
    );
    expect(result[1]).toBeGreaterThan(0);
    expect(result[2]).toBeGreaterThan(0);
  });
});
