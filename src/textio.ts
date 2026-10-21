/** The text boundary: parsing mission input and formatting outcomes. */

import { type Command, DEFAULT_COMMANDS } from "./commands";
import { Grid } from "./grid";
import type { RobotOutcome } from "./mission";
import { Orientation, Position, Robot, RobotState } from "./robot";

export const MAX_COORDINATE = 50;
export const MAX_INSTRUCTION_LENGTH = 99; // spec: "less than 100 characters"

/** Thrown for malformed or out-of-spec mission input. */
export class InputError extends Error {}

/**
 * Parse the full input text into a grid and the robots to run on it.
 *
 * Owns ALL input validation; everything downstream may assume clean
 * data. Every rejection throws an InputError whose message names what
 * was wrong. Blank lines are tolerated anywhere; instruction letters
 * are validated against the given command registry.
 */
export function parseMission(
  text: string,
  commands: Readonly<Record<string, Command>> = DEFAULT_COMMANDS,
): { grid: Grid; robots: Robot[] } {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
  if (lines.length === 0) throw new InputError("input is empty");

  const grid = parseGridLine(lines[0]);

  const robots: Robot[] = [];
  for (let i = 1; i < lines.length; i += 2) {
    const instructionLine = lines[i + 1];
    if (instructionLine === undefined) {
      throw new InputError(`robot position "${lines[i]}" has no instruction line`);
    }
    robots.push(
      new Robot(parseStart(lines[i], grid), parseInstructions(instructionLine, commands)),
    );
  }

  return { grid, robots };
}

/** Render "X Y O", with " LOST" appended for a lost robot. */
export function formatOutcome(outcome: RobotOutcome): string {
  return `${outcome.finalState.position.x} ${outcome.finalState.position.y} ${outcome.finalState.orientation.letter}${outcome.isLost ? " LOST" : ""}`;
}

/** Strictly parse an integer token — parseInt("1x") is 1 and Number("") is 0, so neither is trusted. */
function parseInteger(token: string, context: string): number {
  if (!/^-?\d+$/.test(token)) {
    throw new InputError(`${context}: "${token}" is not an integer`);
  }
  return Number(token);
}

function parseGridLine(line: string): Grid {
  const tokens = line.split(/\s+/);
  if (tokens.length !== 2) {
    throw new InputError(`grid line must be "maxX maxY", got "${line}"`);
  }
  const [maxX, maxY] = tokens.map((token) => parseInteger(token, "grid line"));
  for (const value of [maxX, maxY]) {
    if (value < 0 || value > MAX_COORDINATE) {
      throw new InputError(`grid coordinate ${value} is outside 0..${MAX_COORDINATE}`);
    }
  }
  return new Grid(maxX, maxY);
}

function parseStart(line: string, grid: Grid): RobotState {
  const tokens = line.split(/\s+/);
  if (tokens.length !== 3) {
    throw new InputError(`robot position must be "x y orientation", got "${line}"`);
  }
  const position = new Position(
    parseInteger(tokens[0], "robot position"),
    parseInteger(tokens[1], "robot position"),
  );
  const orientation = Orientation.fromLetter(tokens[2]);
  if (!orientation) {
    throw new InputError(`unknown orientation "${tokens[2]}"`);
  }
  if (!grid.contains(position)) {
    throw new InputError(`robot start (${position.x}, ${position.y}) is off the grid`);
  }
  return new RobotState(position, orientation);
}

function parseInstructions(line: string, commands: Readonly<Record<string, Command>>): string {
  if (line.length > MAX_INSTRUCTION_LENGTH) {
    throw new InputError(
      `instruction string of ${line.length} chars exceeds the maximum of ${MAX_INSTRUCTION_LENGTH}`,
    );
  }
  for (const letter of line) {
    if (!Object.hasOwn(commands, letter)) {
      throw new InputError(`unknown instruction "${letter}"`);
    }
  }
  return line;
}
