import { describe, expect, it } from "vitest";
import { getPuzzlesForLevel } from "../levels";
import { runProgram } from "../simulator";
import type { Command, PuzzleBase } from "../types";

function findSolution(puzzle: PuzzleBase, maxLen: number): Command[] | null {
  function dfs(sequence: Command[]): Command[] | null {
    if (sequence.length > maxLen) {
      return null;
    }
    const result = runProgram(puzzle, sequence);
    if (result.outcome === "success") {
      return sequence;
    }
    for (const command of puzzle.allowedCommands) {
      const found = dfs([...sequence, command]);
      if (found) {
        return found;
      }
    }
    return null;
  }
  return dfs([]);
}

describe("puzzle solvability within maxCommands", () => {
  for (const level of ["easy", "hard"] as const) {
    for (const puzzle of getPuzzlesForLevel(level)) {
      it(`${level} ${puzzle.id} has a solution within ${puzzle.maxCommands} commands`, () => {
        const solution = findSolution(puzzle, puzzle.maxCommands);
        expect(
          solution,
          `${puzzle.id} has no solution within ${puzzle.maxCommands} commands`
        ).not.toBeNull();
      });
    }
  }
});
