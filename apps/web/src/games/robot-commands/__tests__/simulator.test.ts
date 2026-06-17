import { describe, expect, it } from "vitest";
import { getPuzzlesForLevel } from "../levels";
import { runProgram } from "../simulator";
import type { Command, Puzzle } from "../types";

const basePuzzle: Puzzle = {
  id: "test",
  title: "Test",
  gridSize: 3,
  walls: [],
  start: { x: 0, y: 2 },
  startDirection: "north",
  apple: { x: 0, y: 0 },
  maxCommands: 6,
  allowedCommands: ["forward1", "turnRight", "pick"],
  hint: "",
};

describe("runProgram", () => {
  it("reaches apple and picks with forward + pick", () => {
    const commands: Command[] = ["forward1", "forward1", "pick"];
    const result = runProgram(basePuzzle, commands);
    expect(result.outcome).toBe("success");
    expect(result.steps.at(-1)?.pickedApple).toBe(true);
  });

  it("detects wall collision", () => {
    const puzzle: Puzzle = {
      ...basePuzzle,
      walls: [{ x: 0, y: 1 }],
    };
    const result = runProgram(puzzle, ["forward1", "forward1"]);
    expect(result.outcome).toBe("wall");
    expect(result.failIndex).toBe(0);
  });

  it("requires pick command on apple cell", () => {
    const result = runProgram(basePuzzle, ["forward1", "forward1"]);
    expect(result.outcome).toBe("no_pick");
  });

  it("moves two cells with forward2", () => {
    const puzzle: Puzzle = {
      ...basePuzzle,
      start: { x: 0, y: 2 },
      apple: { x: 0, y: 0 },
    };
    const result = runProgram(puzzle, ["forward2", "pick"]);
    expect(result.outcome).toBe("success");
  });

  it("turns right then moves east", () => {
    const puzzle: Puzzle = {
      ...basePuzzle,
      start: { x: 0, y: 1 },
      startDirection: "north",
      apple: { x: 2, y: 1 },
    };
    const commands: Command[] = ["turnRight", "forward1", "forward1", "pick"];
    const result = runProgram(puzzle, commands);
    expect(result.outcome).toBe("success");
  });

  it("easy tutorial puzzle is solvable with one added pick", () => {
    const tutorial = getPuzzlesForLevel("easy")[0];
    const commands: Command[] = [...(tutorial.starterCommands ?? []), "pick"];
    const result = runProgram(tutorial, commands);
    expect(result.outcome).toBe("success");
  });

  it("easy-2 is solvable within six commands", () => {
    const puzzle = getPuzzlesForLevel("easy")[1];
    const commands: Command[] = [
      "forward1",
      "forward1",
      "turnRight",
      "forward1",
      "forward1",
      "pick",
    ];
    const result = runProgram(puzzle, commands);
    expect(result.outcome).toBe("success");
    expect(commands.length).toBeLessThanOrEqual(puzzle.maxCommands);
  });

  it("easy-4 is solvable within six commands", () => {
    const puzzle = getPuzzlesForLevel("easy")[3];
    const commands: Command[] = [
      "forward1",
      "forward1",
      "turnRight",
      "forward1",
      "forward1",
      "pick",
    ];
    const result = runProgram(puzzle, commands);
    expect(result.outcome).toBe("success");
    expect(commands.length).toBeLessThanOrEqual(puzzle.maxCommands);
  });

  it("hard-3 is solvable within six commands", () => {
    const puzzle = getPuzzlesForLevel("hard")[2];
    const commands: Command[] = ["forward2", "forward1", "pick"];
    const result = runProgram(puzzle, commands);
    expect(result.outcome).toBe("success");
    expect(commands.length).toBeLessThanOrEqual(puzzle.maxCommands);
  });

  it("hard-4 is solvable within six commands", () => {
    const puzzle = getPuzzlesForLevel("hard")[3];
    const commands: Command[] = [
      "forward2",
      "forward1",
      "turnRight",
      "forward2",
      "forward1",
      "pick",
    ];
    const result = runProgram(puzzle, commands);
    expect(result.outcome).toBe("success");
    expect(commands.length).toBeLessThanOrEqual(puzzle.maxCommands);
  });
});
