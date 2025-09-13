
import { Maze } from "./maze/maze.mjs";
import { MazeDisplay } from "./maze/display.mjs";
import { kruskal } from "./maze/generators.mjs";
import { maskedEval } from "./util/masked_eval.mjs";
import { Vec2 } from "./types.mjs";
import { Memory } from "./memory.mjs";

let maze = new Maze(25, 25);
let display = new MazeDisplay(document.getElementById("maze")!, maze);
let memory = new Memory();

/**
 * Run the user code a single time
 */
function step(): void {
    let code = (document.getElementById("code") as HTMLInputElement).value;
    maskedEval(code, {
        move: moveConstructor(),
        get: getConstructor(),
        loadBit: (index: number) => memory.load(index),
        storeBit: (index: number, value: boolean) => memory.store(index, value),
        loadInt: (index: number, size: number) => memory.loadUInt(index, size),
        storeInt: (index: number, size: number, value: number) =>
            memory.storeUInt(index, size, value),
    });
    console.log("Bits used:", memory.size);
}

/**
 * Convert a direction given as a number 0 (up), 1 (right), 2 (down), 3 (left)
 * to a position delta
 * @param direction The direction as a number from [0,1,2,3]
 * @returns The delta with x and y. If the direction is invalid an error is
 * thrown
 */
function directionToDelta(direction: number): Vec2 {
    switch (direction) {
        case 0: return {x: 0, y: -1};
        case 1: return {x: 1, y: 0};
        case 2: return {x: 0, y: 1};
        case 3: return {x: -1, y: 0};
        default:
            throw new Error(`Invalid direction ${direction}, should be in ` +
            `[0,1,2,3]`);
    }
}

/**
 * Function wrapper that returns a function that can move the player
 * @returns The function that can be called to move the player
 */
function moveConstructor(): (direction: number) => void {
    let hasMoved = false;
    let move = (direction: number) => {
        if (hasMoved)
            throw new Error("Cannot move multiple times in one step");
        hasMoved = true;
        maze.move(directionToDelta(direction));
        display.update();
    };
    return move;
}

/**
 * Function wrapper that returns a function that can get the tile type in a
 * given direction. Returned number will be 0 for empty cells, 1 for walls and 2
 * for the finish
 * @returns The function that can called to get an adjacent tile type
 */
function getConstructor(): (direction: number) => number {
    let get = (direction: number) => {
        let playerPos = maze.player;
        let delta = directionToDelta(direction);
        let targetPos = {x: playerPos.x + delta.x, y: playerPos.y + delta.y};
        return maze.getCell(targetPos);
    }
    return get;
}

document.getElementById("step-button")!.addEventListener("click", step);

kruskal(maze, {
    extraEdgeChance: 1,
});
display.update();