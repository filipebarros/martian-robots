import { describe, expect, it } from "vitest";

import { Orientation, Position, Robot, RobotState } from "../src/robot";

describe("Orientation.left", () => {
  it("turns north to west", () => {
    expect(Orientation.NORTH.left()).toBe(Orientation.WEST);
  });

  it("turns west to south", () => {
    expect(Orientation.WEST.left()).toBe(Orientation.SOUTH);
  });

  it("turns south to east", () => {
    expect(Orientation.SOUTH.left()).toBe(Orientation.EAST);
  });

  it("turns east to north", () => {
    expect(Orientation.EAST.left()).toBe(Orientation.NORTH);
  });
});

describe("Orientation.right", () => {
  it("turns north to east", () => {
    expect(Orientation.NORTH.right()).toBe(Orientation.EAST);
  });

  it("turns east to south", () => {
    expect(Orientation.EAST.right()).toBe(Orientation.SOUTH);
  });

  it("turns south to west", () => {
    expect(Orientation.SOUTH.right()).toBe(Orientation.WEST);
  });

  it("turns west to north", () => {
    expect(Orientation.WEST.right()).toBe(Orientation.NORTH);
  });
});

describe("Orientation.vector", () => {
  it("north is [0, 1]", () => {
    expect(Orientation.NORTH.vector()).toEqual([0, 1]);
  });

  it("south is [0, -1]", () => {
    expect(Orientation.SOUTH.vector()).toEqual([0, -1]);
  });

  it("east is [1, 0]", () => {
    expect(Orientation.EAST.vector()).toEqual([1, 0]);
  });

  it("west is [-1, 0]", () => {
    expect(Orientation.WEST.vector()).toEqual([-1, 0]);
  });
});

describe("value semantics", () => {
  it("positions compare structurally (via toEqual)", () => {
    // Pins the value semantics every assertion in this suite relies on.
    expect(new Position(1, 2)).toEqual(new Position(1, 2));
  });

  it("robots compare structurally (via toEqual)", () => {
    const start = new RobotState(new Position(1, 1), Orientation.EAST);
    expect(new Robot(start, "LRF")).toEqual(new Robot(start, "LRF"));
  });
});
