# Martian Robots

Barclaycard Payments "Martian Robots" tech test: robots follow instruction
strings across a bounded grid on Mars. A robot stepping off the edge is lost
forever, but leaves a *scent* so later robots ignore the same fatal move.

## Run

Requires Node >= 20.11 (dependencies pinned by `package-lock.json`):

```sh
npm install
npm start -- sample_input.txt            # read mission from a file
cat sample_input.txt | npm start         # ... or from stdin
npm test                                 # run the tests
npm run typecheck                        # strict tsc, no emit
npm run lint                             # biome (lint + format + import order)
```

`sample_input.txt` is the brief's example; expected output:

```
1 1 E
3 3 N LOST
2 3 S
```

## Design decisions

- **Commands are pure `RobotState -> RobotState` transitions; world rules
  (bounds, scent, loss) live only in the `Mission` loop.** Commands are
  plain functions dispatched through a registry; the parser validates
  instruction letters against that same registry.
- **Outcomes are data** (`RobotOutcome`: final on-grid state + `isLost`);
  the word `LOST` exists only in the formatter.
- **Value objects throughout**: `Position`, `RobotState`, `Robot` are
  immutable (`readonly` fields). JS `Set` compares by reference, so `Grid`
  keys its scent record by coordinate string internally — that keying never
  leaks outside `grid.ts`.
- **Invariants live on their owners**: `Grid` owns "is this point on the
  world"; the parser owns input limits (coordinates 0–50, instructions under
  100 chars, known letters, on-grid start) and fails fast with `InputError`.

## Assumptions

- Scent marks a grid *point*, not a (point, direction) pair — the spec's
  wording.
- An off-grid start position is malformed input, not a "born lost" robot.
- "Less than 100 characters" means 99 is the longest accepted instruction.
- Blank input lines are ignored; anything else malformed is rejected.
- No collision rule: the spec defines none, so robots may share a point.

## Deliberately not built

- No CLI framework — one optional file argument needs no parsing library.
- No per-direction scent, robot IDs, collisions, or wrap-around geometry —
  not in the spec.
- No streaming input or concurrency — the spec bounds input size and makes
  robots explicitly sequential.
