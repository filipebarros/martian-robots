/** Core value types: where a robot is, which way it faces, what it was told. */

export class Orientation {
  static readonly NORTH = new Orientation("N");
  static readonly EAST = new Orientation("E");
  static readonly SOUTH = new Orientation("S");
  static readonly WEST = new Orientation("W");

  /** Declaration order is the compass rose, clockwise. */
  private static readonly COMPASS = [
    Orientation.NORTH,
    Orientation.EAST,
    Orientation.SOUTH,
    Orientation.WEST,
  ];

  private constructor(readonly letter: "N" | "E" | "S" | "W") {}

  /** The orientation spelled by a letter, or undefined — the parser turns that into an InputError. */
  static fromLetter(letter: string): Orientation | undefined {
    return Orientation.COMPASS.find((o) => o.letter === letter);
  }

  left(): Orientation {
    const currentOrientationIndex = Orientation.COMPASS.indexOf(this);
    return Orientation.COMPASS[(currentOrientationIndex - 1 + 4) % 4];
  }

  right(): Orientation {
    const currentOrientationIndex = Orientation.COMPASS.indexOf(this);
    return Orientation.COMPASS[(currentOrientationIndex + 1) % 4];
  }

  /**
   * [dx, dy] of one forward step in this orientation; north is [0, 1].
   *
   * The single owner of "which way is north" — movement commands compose
   * this rather than re-encoding directions.
   */
  vector(): readonly [dx: number, dy: number] {
    switch (this.letter) {
      case "N":
        return [0, 1];
      case "E":
        return [1, 0];
      case "S":
        return [0, -1];
      case "W":
        return [-1, 0];
    }
  }
}

/** A grid coordinate. A pure value — compare with toEqual, never ===. */
export class Position {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}
}

/** A robot's in-world state: where it is and which way it faces. */
export class RobotState {
  constructor(
    readonly position: Position,
    readonly orientation: Orientation,
  ) {}
}

/**
 * A robot as dispatched from Earth: its landing state and its orders.
 *
 * Pure value — executing the orders under the world's rules is Mission's
 * job; parsing text into Robots is textio's.
 */
export class Robot {
  constructor(
    readonly start: RobotState,
    readonly instructions: string,
  ) {}
}
