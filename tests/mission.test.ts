import { describe, expect, it } from "vitest";

import { Grid } from "../src/grid";
import { Mission, RobotOutcome } from "../src/mission";
import { Orientation, Position, Robot, RobotState } from "../src/robot";

function state(x: number, y: number, facing: string): RobotState {
  const orientation = Orientation.fromLetter(facing);
  if (!orientation) throw new Error(`bad test facing: ${facing}`);
  return new RobotState(new Position(x, y), orientation);
}

describe("Mission.runRobot", () => {
  it("leaves the robot in place when there are no instructions", () => {
    const outcome = new Mission(new Grid(5, 3)).runRobot(new Robot(state(1, 1, "E"), ""));
    expect(outcome).toEqual(new RobotOutcome(state(1, 1, "E"), false));
  });

  it("returns the square dance to its start", () => {
    const outcome = new Mission(new Grid(5, 3)).runRobot(new Robot(state(1, 1, "E"), "RFRFRFRF"));
    expect(outcome).toEqual(new RobotOutcome(state(1, 1, "E"), false));
  });

  it("marks a robot moving off the grid as lost", () => {
    const outcome = new Mission(new Grid(5, 3)).runRobot(new Robot(state(0, 3, "N"), "F"));
    expect(outcome.isLost).toBe(true);
  });

  it("reports a lost robot's last on-grid state", () => {
    const outcome = new Mission(new Grid(5, 3)).runRobot(new Robot(state(0, 3, "N"), "F"));
    expect(outcome.finalState).toEqual(state(0, 3, "N"));
  });

  it("ignores a lost robot's remaining instructions", () => {
    const outcome = new Mission(new Grid(5, 3)).runRobot(new Robot(state(0, 3, "N"), "FLL"));
    expect(outcome.finalState.orientation).toBe(Orientation.NORTH);
  });

  it("leaves a scent when a robot is lost", () => {
    const grid = new Grid(5, 3);
    new Mission(grid).runRobot(new Robot(state(0, 3, "N"), "F"));
    expect(grid.hasScent(new Position(0, 3))).toBe(true);
  });

  it("makes the fatal instruction a no-op on a scented point", () => {
    const grid = new Grid(5, 3);
    grid.leaveScent(new Position(0, 3));
    const outcome = new Mission(grid).runRobot(new Robot(state(0, 3, "N"), "F"));
    expect(outcome).toEqual(new RobotOutcome(state(0, 3, "N"), false));
  });

  it("still allows safe moves from a scented point", () => {
    const grid = new Grid(5, 3);
    grid.leaveScent(new Position(0, 3));
    const outcome = new Mission(grid).runRobot(new Robot(state(0, 3, "E"), "F"));
    expect(outcome).toEqual(new RobotOutcome(state(1, 3, "E"), false));
  });
});

describe("Mission.run", () => {
  it("shares scent between sequential robots", () => {
    const mission = new Mission(new Grid(5, 3));
    const outcomes = mission.run([
      new Robot(state(0, 3, "N"), "F"),
      new Robot(state(0, 3, "N"), "F"),
    ]);
    expect(outcomes.map((o) => o.isLost)).toEqual([true, false]);
    expect(outcomes[1].finalState).toEqual(state(0, 3, "N"));
  });

  it("returns no outcomes for no robots", () => {
    expect(new Mission(new Grid(5, 3)).run([])).toEqual([]);
  });
});
