import { describe, expect, it } from "vitest";

import { RobotOutcome } from "../src/mission";
import { Orientation, Position, RobotState } from "../src/robot";
import { formatOutcome, InputError, parseMission } from "../src/textio";

const SAMPLE_INPUT = `5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
`;

describe("parseMission", () => {
  describe("valid input", () => {
    it("parses the grid line", () => {
      const { grid } = parseMission("5 3\n");
      expect([grid.maxX, grid.maxY]).toEqual([5, 3]);
    });

    it("parses a robot's start state", () => {
      const { robots } = parseMission("5 3\n1 1 E\nRFRFRFRF\n");
      expect(robots[0].start).toEqual(new RobotState(new Position(1, 1), Orientation.EAST));
    });

    it("parses multiple robots in order", () => {
      const { robots } = parseMission(SAMPLE_INPUT);
      expect(robots).toHaveLength(3);
      expect(robots[1].instructions).toBe("FRRFLLFFRRFLL");
    });

    it("ignores blank lines", () => {
      const { robots } = parseMission("5 3\n\n1 1 E\nRFRFRFRF\n\n0 3 W\nLLFFFLFLFL\n");
      expect(robots).toHaveLength(2);
    });

    it("accepts an instruction string of 99 chars", () => {
      // Boundary of the spec's "less than 100 characters".
      const { robots } = parseMission(`5 3\n1 1 E\n${"F".repeat(99)}\n`);
      expect(robots[0].instructions).toBe("F".repeat(99));
    });
  });

  describe("rejection (one test per validation guard)", () => {
    it("rejects empty input", () => {
      expect(() => parseMission("")).toThrow(InputError);
    });

    it("rejects a malformed grid line", () => {
      expect(() => parseMission("5\n")).toThrow(InputError);
    });

    it("rejects a grid coordinate over fifty", () => {
      expect(() => parseMission("51 3\n")).toThrow(InputError);
    });

    it("rejects a negative grid coordinate", () => {
      expect(() => parseMission("-1 3\n")).toThrow(InputError);
    });

    it("rejects a malformed robot position", () => {
      expect(() => parseMission("5 3\n1 1\nRFRF\n")).toThrow(InputError);
    });

    it("rejects an unknown orientation", () => {
      expect(() => parseMission("5 3\n1 1 Q\nRFRF\n")).toThrow(InputError);
    });

    it("rejects a robot starting off-grid", () => {
      expect(() => parseMission("5 3\n9 9 N\nF\n")).toThrow(InputError);
    });

    it("rejects an instruction string of 100 chars", () => {
      expect(() => parseMission(`5 3\n1 1 E\n${"F".repeat(100)}\n`)).toThrow(InputError);
    });

    it("rejects an unknown instruction character", () => {
      expect(() => parseMission("5 3\n1 1 E\nFXF\n")).toThrow(InputError);
    });

    it("rejects a position line without an instruction line", () => {
      expect(() => parseMission("5 3\n1 1 E\n")).toThrow(InputError);
    });
  });
});

describe("formatOutcome", () => {
  it("formats an on-grid outcome", () => {
    const outcome = new RobotOutcome(new RobotState(new Position(1, 1), Orientation.EAST), false);
    expect(formatOutcome(outcome)).toBe("1 1 E");
  });

  it("formats a lost outcome", () => {
    const outcome = new RobotOutcome(new RobotState(new Position(3, 3), Orientation.NORTH), true);
    expect(formatOutcome(outcome)).toBe("3 3 N LOST");
  });
});
