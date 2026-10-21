/** Process entry point: wires the real argv and exit code to main(). */

import { main } from "./cli";

process.exitCode = main(process.argv.slice(2));
