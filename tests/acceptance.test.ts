/** Golden end-to-end tests: the exact PDF sample through the CLI. */

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it, vi } from "vitest";

import { main } from "../src/cli";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SAMPLE_INPUT_FILE = path.join(ROOT, "sample_input.txt");
const EXPECTED_LINES = ["1 1 E", "3 3 N LOST", "2 3 S"];

afterEach(() => {
  vi.restoreAllMocks();
});

/** Runs the real CLI process (exercises main.ts wiring, stdin, and exit codes). */
function runCli(args: string[], input?: string) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/main.ts", ...args], {
    cwd: ROOT,
    input,
    encoding: "utf8",
  });
}

describe("CLI", () => {
  it("runs the PDF sample via a file argument", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const exitCode = main([SAMPLE_INPUT_FILE]);
    expect(exitCode).toBe(0);
    expect(log.mock.calls.map((call) => call[0])).toEqual(EXPECTED_LINES);
  });

  it("runs the PDF sample via stdin through the real process", () => {
    const result = runCli([], readFileSync(SAMPLE_INPUT_FILE, "utf8"));
    expect(result.status).toBe(0);
    expect(result.stdout).toBe(`${EXPECTED_LINES.join("\n")}\n`);
  });

  it("rejects invalid input with exit code 1 and a stderr message", () => {
    const result = runCli([], "not a mission\n");
    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).not.toBe("");
    // A handled InputError prints a message; a crash prints a stack trace.
    expect(result.stderr).not.toMatch(/\n\s+at /);
  });
});
