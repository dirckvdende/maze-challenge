
export { Simulator, ErrorLevel, ErrorMessage, SimStats };
import { maskedEval } from "../util/masked_eval.mjs";
import { Maze, MazeSquare } from "./maze.mjs";
import { Vec2 } from "../types.mjs";
import { Memory } from "../memory.mjs";

/**
 * Level of an error message
 */
enum ErrorLevel {
    NOTE,
    WARNING,
    ERROR,
};

/**
 * Error message with severity level and error text
 */
type ErrorMessage = {
    level: ErrorLevel,
    text: string,
};

// Simulation statistics
type SimStats = {
    memoryUsed: number,
    steps: number,
};

/**
 * Object used to simulate movement in a maze
 */
class Simulator {

    // The code to execute when performing a step
    stepCode: string;
    // The maze to simulate on
    #maze: Maze;
    // Errors thrown during the current step
    #stepErrors: ErrorMessage[];
    // Timeout used for an active simulation. Only exists if a simulation with
    // "timeout" option was started
    #simTimeout: number;
    // Memory object that can be accessed from the step code
    #memory: Memory;
    // Simulation statistics
    #stats = {
        steps: 0,
    };

    /**
     * Constructor
     * @param maze The maze to use to simulate
     */
    constructor(maze: Maze) {
        this.#maze = maze;
        this.stepCode = "";
        this.#stepErrors = [];
        this.#simTimeout = -1;
        this.#memory = new Memory();
    }

    /**
     * Copy of errors thrown during the current step
     */
    get stepErrors(): ErrorMessage[] {
        let errors: ErrorMessage[] = [];
        for (let error of this.#stepErrors)
            errors.push({...error});
        return errors;
    }

    /**
     * Simulation statistics
     */
    get stats(): SimStats {
        return {
            memoryUsed: this.#memory.size,
            ...this.#stats,
        };
    }

    /**
     * Whether a simulation with a timeout has started
     */
    get isSimulating(): boolean {
        return this.#simTimeout != -1;
    }

    /**
     * Perform a single step in the simulation
     */
    step(): void {
        this.#stepErrors = [];
        let hasMoved = false;
        maskedEval(this.stepCode, {
            move: (direction: number) => {
                if (hasMoved) {
                    this.#stepErrors.push({
                        level: ErrorLevel.ERROR,
                        text: "Attempted to use `move` multiple times",
                    });
                    return;
                }
                hasMoved = true;
                let delta = this.#directionToDelta(direction);
                if (delta == null)
                    return;
                let moved = this.#maze.move(delta);
                if (!moved)
                    this.#stepErrors.push({
                        level: ErrorLevel.WARNING,
                        text: "Player could not move because there was a wall",
                    });
            },
            get: (direction: number) => {
                let playerPos = this.#maze.player;
                let delta = this.#directionToDelta(direction);
                if (delta == null)
                    return MazeSquare.EMPTY;
                let targetPos = {
                    x: playerPos.x + delta.x,
                    y: playerPos.y + delta.y,
                };
                return this.#maze.getCell(targetPos);
            },
            loadBit: (index: number) =>
                this.#memory.load(index),
            storeBit: (index: number, value: boolean) =>
                this.#memory.store(index, value),
            loadInt: (index: number, size: number) =>
                this.#memory.loadUInt(index, size),
            storeInt: (index: number, size: number, value: number) =>
                this.#memory.storeUInt(index, size, value),
        });
        this.#stats.steps++;
    }

    /**
     * Continuously simulate until the player has reached the finish, or until
     * a fixed number of steps have been done
     * @param options Simulation options:
     * - `timeout` &mdash; A number of milliseconds to wait between steps, can
     * be zero. If this is set the simulation can be stopped using
     * stopSimulation() and isSimulating() will return true. By default the
     * entire simulation will be blocking
     * - `maxSteps` &mdash; Maximum number of steps to perform. Defaults to
     * 10,000 if no timeout is set, and infinity if a timeout is set. Note that
     * the simulation automatically stops if a finish cell is reached
     */
    simulate(options?: {timeout?: number, maxSteps?: number}): void {
        // Copy options
        options = {...options};
        options.maxSteps ??= (options.timeout == undefined ? 10000 : Infinity);
        let simStep = () => {
            
        };
        if (options.timeout == undefined) {
            let steps = 0;
            while (!this.#maze.finished && steps < options.maxSteps) {
                simStep();
                steps++;
            }
        } else {
            let steps = 0;
            let handler = () => {
                this.#simTimeout = -1;
                if (steps >= (options.maxSteps ?? Infinity) ||
                this.#maze.finished)
                    return;
                simStep();
                steps++;
                this.#simTimeout = setTimeout(handler, options.timeout ?? 1);
            }
            this.#simTimeout = setTimeout(handler, options.timeout);
        }
    }

    /**
     * Stop any simulation with a timeout. This has no effect if there is no
     * active simulation
     */
    stopSimulating(): void {
        if (this.#simTimeout == -1)
            return;
        clearTimeout(this.#simTimeout);
        this.#simTimeout = -1;
    }

    /**
     * Convert a direction given as a number 0 (up), 1 (right), 2 (down), 3
     * (left) to a position delta
     * @param direction The direction as a number from [0,1,2,3]
     * @returns The delta with x and y. If the direction is invalid null
     * is returned
     */
    #directionToDelta(direction: number): Vec2 | null {
        switch (direction) {
            case 0: return {x: 0, y: -1};
            case 1: return {x: 1, y: 0};
            case 2: return {x: 0, y: 1};
            case 3: return {x: -1, y: 0};
            default:
                this.#stepErrors.push({
                    level: ErrorLevel.ERROR,
                    text: `Invalid direction ${direction}, should be in ` +
                    `[0,1,2,3]`,
                });
                return null;
        }
    }

}