/**
 * Robot commands.
 *
 * A command is a pure state transition — it knows nothing about the grid.
 * World rules (bounds, scent, loss) are enforced in exactly one place,
 * the Mission loop.
 */

import { Position, RobotState } from "./robot";

/** A pure transition from one robot state to the intended next state. */
export type Command = (state: RobotState) => RobotState;

/** Turn 90 degrees left in place. */
export function turnLeft(state: RobotState): RobotState {
  return new RobotState(state.position, state.orientation.left());
}

/** Turn 90 degrees right in place. */
export function turnRight(state: RobotState): RobotState {
  return new RobotState(state.position, state.orientation.right());
}

/**
 * Step one grid point in the current orientation.
 *
 * Deliberately no bounds check: the intended position may be off-grid,
 * and it is Mission's job to decide what that means.
 */
export function moveForward(state: RobotState): RobotState {
  const [movementVectorX, movementVectorY] = state.orientation.vector();
  return new RobotState(
    new Position(state.position.x + movementVectorX, state.position.y + movementVectorY),
    state.orientation,
  );
}

/** The standard instruction set: the letters the brief defines. */
export const DEFAULT_COMMANDS: Readonly<Record<string, Command>> = {
  L: turnLeft,
  R: turnRight,
  F: moveForward,
};
