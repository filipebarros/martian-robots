/** Command-line behaviour: mission text in, one line per robot out. */

import { readFileSync } from "node:fs";

import { Mission } from "./mission";
import { formatOutcome, InputError, parseMission } from "./textio";

/**
 * Run a mission read from a file-path argument, or stdin if absent.
 *
 * Returns the process exit code: 0 on success; 1 for bad input or an
 * unreadable file, with the reason on stderr and nothing on stdout.
 * Anything else is a bug and is allowed to crash loudly.
 */
export function main(argv: readonly string[]): number {
  let text: string;
  try {
    // File descriptor 0 reads piped stdin synchronously when no path is given.
    text = readFileSync(argv[0] ?? 0, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      console.error(`cannot read input: ${error.message}`);
      return 1;
    }
    throw error;
  }

  try {
    const { grid, robots } = parseMission(text);
    for (const outcome of new Mission(grid).run(robots)) {
      console.log(formatOutcome(outcome));
    }
  } catch (error) {
    if (error instanceof InputError) {
      console.error(error.message);
      return 1;
    }
    throw error;
  }

  return 0;
}
