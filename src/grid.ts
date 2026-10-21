/** The bounded rectangular world and the scents lost robots leave behind. */

import type { Position } from "./robot";

/**
 * Mars: a bounded rectangle from (0, 0) to (maxX, maxY), inclusive.
 *
 * Owns the geometric rule ("is this point on the world?") and the scent
 * record. Input-level constraints (such as the maximum coordinate of 50)
 * belong to the parser, not here.
 */
export class Grid {
  // JS Sets compare by reference, not structure, so two equal Positions
  // would be two different members. We key scents by coordinate string
  // ("x,y") instead — that keying must stay private to this class.
  private readonly scents = new Set<string>();

  constructor(
    readonly maxX: number,
    readonly maxY: number,
  ) {}

  /** True if the position lies on the grid (bounds are inclusive at both ends). */
  contains(position: Position): boolean {
    return position.x >= 0 && position.x <= this.maxX && position.y >= 0 && position.y <= this.maxY;
  }

  /** True if a robot was previously lost from this grid point. */
  hasScent(position: Position): boolean {
    return this.scents.has(this.key(position));
  }

  /** Record that a robot was lost from this grid point. */
  leaveScent(position: Position): void {
    this.scents.add(this.key(position));
  }

  private key(position: Position): string {
    return `${position.x},${position.y}`;
  }
}
