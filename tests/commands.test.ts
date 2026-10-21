import { describe, expect, it } from "vitest";

import { moveForward, turnLeft, turnRight } from "../src/commands";
import { Orientation, Position, RobotState } from "../src/robot";

describe("turnLeft", () => {
  it("turns in place", () => {
    const state = new RobotState(new Position(1, 1), Orientation.NORTH);
    expect(turnLeft(state)).toEqual(new RobotState(new Position(1, 1), Orientation.WEST));
  });
});

describe("turnRight", () => {
  it("turns in place", () => {
    const state = new RobotState(new Position(1, 1), Orientation.NORTH);
    expect(turnRight(state)).toEqual(new RobotState(new Position(1, 1), Orientation.EAST));
  });
});

describe("moveForward", () => {
  it("east increments x", () => {
    const state = new RobotState(new Position(1, 1), Orientation.EAST);
    expect(moveForward(state)).toEqual(new RobotState(new Position(2, 1), Orientation.EAST));
  });

  it("south decrements y", () => {
    const state = new RobotState(new Position(1, 1), Orientation.SOUTH);
    expect(moveForward(state)).toEqual(new RobotState(new Position(1, 0), Orientation.SOUTH));
  });
});
