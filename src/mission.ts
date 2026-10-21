/** Mission orchestration: applies world rules to pure command transitions. */

import { type Command, DEFAULT_COMMANDS } from "./commands";
import type { Grid } from "./grid";
import type { Robot, RobotState } from "./robot";

/**
 * The result of one robot's run, kept as data; formatting lives elsewhere.
 *
 * finalState is the last on-grid state — for a lost robot, the state it
 * held just before falling off.
 */
export class RobotOutcome {
  constructor(
    readonly finalState: RobotState,
    readonly isLost: boolean,
  ) {}
}

/**
 * Runs robots sequentially on a shared grid.
 *
 * The single home of the world rules: each command proposes an intended
 * next state, and the mission accepts it, ignores it (fatal move from a
 * scented point), or records a loss and leaves a scent.
 */
export class Mission {
  constructor(
    readonly grid: Grid,
    readonly commands: Readonly<Record<string, Command>> = DEFAULT_COMMANDS,
  ) {}

  /**
   * Run one robot's instructions to completion (or to loss).
   *
   * Each command proposes an intended next state and the world decides:
   * an on-grid move is accepted; a fatal move from a scented point is
   * simply ignored; otherwise the robot is lost — it leaves a scent at
   * its last on-grid position, keeps that pre-fall state as its outcome,
   * and its remaining instructions never run. An unknown instruction
   * letter is a programming error (the parser validates input), so the
   * lookup is allowed to crash.
   */
  runRobot(robot: Robot): RobotOutcome {
    let state = robot.start;

    for (const char of robot.instructions) {
      const intended = this.commands[char](state);
      if (this.grid.contains(intended.position)) {
        state = intended;
      } else if (!this.grid.hasScent(state.position)) {
        this.grid.leaveScent(state.position);
        return new RobotOutcome(state, true);
      }
      // A fatal move from a scented point falls through: "simply ignored".
    }

    return new RobotOutcome(state, false);
  }

  /** Run each robot in order on the shared grid; one outcome per robot, same order. */
  run(robots: readonly Robot[]): RobotOutcome[] {
    return robots.map((robot) => this.runRobot(robot));
  }
}
