import { describe, expect, it } from "vitest";

import { Grid } from "../src/grid";
import { Position } from "../src/robot";

describe("Grid.contains", () => {
  it("contains an interior point", () => {
    expect(new Grid(5, 3).contains(new Position(2, 1))).toBe(true);
  });

  it("contains the origin", () => {
    expect(new Grid(5, 3).contains(new Position(0, 0))).toBe(true);
  });

  it("contains the upper-right corner", () => {
    expect(new Grid(5, 3).contains(new Position(5, 3))).toBe(true);
  });

  it("does not contain x beyond max", () => {
    expect(new Grid(5, 3).contains(new Position(6, 1))).toBe(false);
  });

  it("does not contain y beyond max", () => {
    expect(new Grid(5, 3).contains(new Position(1, 4))).toBe(false);
  });

  it("does not contain negative x", () => {
    expect(new Grid(5, 3).contains(new Position(-1, 0))).toBe(false);
  });

  it("does not contain negative y", () => {
    expect(new Grid(5, 3).contains(new Position(0, -1))).toBe(false);
  });
});

describe("Grid scent record (hasScent / leaveScent)", () => {
  it("a new grid has no scent", () => {
    expect(new Grid(5, 3).hasScent(new Position(3, 3))).toBe(false);
  });

  it("leaveScent marks only that point", () => {
    const grid = new Grid(5, 3);
    grid.leaveScent(new Position(3, 3));
    expect(grid.hasScent(new Position(3, 3))).toBe(true);
    expect(grid.hasScent(new Position(3, 2))).toBe(false);
  });
});
