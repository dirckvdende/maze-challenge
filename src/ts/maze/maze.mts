
export { Maze, MazeSquare };
import { Vec2 } from "../types.mjs";

// Static square in a maze
enum MazeSquare {
    EMPTY,
    WALL,
    FINISH,
};

/**
 * Generic maze with squares 
 */
class Maze {

    // Width of the grid
    #width: number;
    // Height of the grid
    #height: number;
    // Grid cells
    #grid: MazeSquare[][];
    // Player position
    #player: Vec2;

    /**
     * Constructor. Initially the maze will contain only empty squares and a
     * finish square in the bottom right. The player will be in the top left
     * @param width The width of the maze
     * @param height The height of the maze (default: same as width)
     */
    constructor(width: number, height?: number) {
        this.#width = width;
        this.#height = height ?? this.#width;
        this.#grid = [];
        for (let i = 0; i < this.#height; i++) {
            let row: MazeSquare[] = [];
            for (let j = 0; j < this.#width; j++)
                row.push(MazeSquare.EMPTY);
            this.#grid.push(row);
        }
        this.#grid[this.#height - 1][this.#width - 1] = MazeSquare.FINISH;
        this.#player = {x: 0, y: 0};
    }

    // Position of the player on the grid
    get player(): Vec2 { return this.#player; }
    set player(value: Vec2) { this.#player = value; }

    // Whether the player has reached a finish square
    get finished(): boolean {
        return this.getCell(this.#player) == MazeSquare.FINISH;
    }

    // Width of the maze
    get width(): number { return this.#width; }

    // Height of the maze
    get height(): number { return this.#height; }

    // Number of fitting "chambers" in the width of the maze
    get chamberWidth(): number { return Math.floor((this.#width - 1) / 2); }
    // Number of fitting "chambers" in the height of the maze
    get chamberHeight(): number { return Math.floor((this.#height - 1) / 2); }

    /**
     * Set the type of a cell in the maze
     * @param pos The position of the cell
     * @param squareType The type of square to set the cell to
     */
    setCell(pos: Vec2, squareType: MazeSquare): void {
        this.#grid[pos.y][pos.x] = squareType;
    }

    /**
     * Get the type of a cell in the maze
     * @param pos The position of the cell
     */
    getCell(pos: Vec2): MazeSquare {
        return this.#grid[pos.y][pos.x];
    }

    /**
     * Move the player relative to its current position. If it is not possible
     * to move to the new position nothing happens
     * @param delta The relative movement of the player
     * @returns A boolean indicating if the movement was successful
     */
    move(delta: Vec2): boolean {
        let target = {x: this.#player.x + delta.x, y: this.#player.y + delta.y};
        if (!this.#playerCanMoveTo(target))
            return false;
        this.#player = target;
        return true;
    }

    /**
     * Fill the entire maze grid with a single type of square
     * @param squareType The square type to fill the grid with. Defaults to wall
     */
    fill(squareType: MazeSquare = MazeSquare.WALL): void {
        for (let i = 0; i < this.#height; i++)
            for (let j = 0; j < this.#width; j++)
                this.#grid[i][j] = squareType;
    }

    /**
     * Fill the entire maze grid with walls, only leaving a pattern of
     * "chambers" with one wall between them. The finish will be placed in the
     * bottom left corner
     */
    fillChambers(): void {
        this.fill(MazeSquare.WALL);
        for (let i = 0; i < this.chamberHeight; i++)
            for (let j = 0; j < this.chamberWidth; j++)
                this.#grid[i * 2 + 1][j * 2 + 1] = MazeSquare.EMPTY;
        (this.#grid[this.chamberHeight * 2 - 1][this.chamberWidth * 2 - 1] =
        MazeSquare.FINISH);
    }

    /**
     * Connect two cells that align either horizontally or vertically with
     * placing empty cells between them (and also on the two end points)
     * @param start The first point to connect
     * @param end The second point to connect
     * @note If the two points do not have the same x-coord or y-coord, an error
     * is thrown
     */
    connect(start: Vec2, end: Vec2): void {
        if (start.x != end.x && start.y != end.y)
            throw new Error("Points to connect don't have same x or y-coord");
        for (let x = Math.min(start.x, end.x); x <= Math.max(start.x, end.x);
        x++)
            for (let y = Math.min(start.y, end.y); y <= Math.max(start.y,
            end.y); y++)
                this.setCell({x, y}, MazeSquare.EMPTY);
    }

    /**
     * Connect two chambers that align either horizontally or vertically with
     * placing empty cells between them (and also on the two end points)
     * @param start The first chamber to connect
     * @param end The second chamber to connect
     * @note If the two points do not have the same x-coord or y-coord, an error
     * is thrown
     */
    connectChambers(start: Vec2, end: Vec2): void {
        this.connect({
            x: start.x * 2 + 1,
            y: start.y * 2 + 1,
        }, {
            x: end.x * 2 + 1,
            y: end.y * 2 + 1,
        });
    }

    /**
     * Randomize the position of the player and the finish tile to an empty
     * cell. Any existing finish is removed
     */
    randomStartAndFinish(): void {
        let emptyCount = 0;
        for (let i = 0; i < this.#height; i++) {
            for (let j = 0; j < this.#width; j++) {
                if (this.#grid[i][j] == MazeSquare.FINISH)
                    this.#grid[i][j] = MazeSquare.EMPTY;
                if (this.#grid[i][j] == MazeSquare.EMPTY)
                    emptyCount++;
            }
        }
        if (emptyCount == 0)
            throw new Error("Cannot place player and finish with 0 empty " +
            "cells");
        let start = 0, end = 0;
        while (start == end && emptyCount >= 2) {
            start = Math.floor(Math.random() * emptyCount);
            end = Math.floor(Math.random() * emptyCount);
        }
        let seen = 0;
        for (let i = 0; i < this.#height; i++) {
            for (let j = 0; j < this.#width; j++) {
                if (this.#grid[i][j] != MazeSquare.EMPTY)
                    continue;
                if (start == seen)
                    this.#player = {x: j, y: i};
                if (end == seen)
                    this.#grid[i][j] = MazeSquare.FINISH;
                seen++;
            }
        }
    }

    /**
     * Check if the player can be moved to a given position. Coordinates are
     * expected to be integers
     * @param pos The position to check
     * @returns A boolean indicating if the player can be moved to the position
     */
    #playerCanMoveTo(pos: Vec2): boolean {
        if (pos.x < 0 || pos.x >= this.#width || pos.y < 0
        || pos.y >= this.#height)
            return false;
        return this.getCell(pos) != MazeSquare.WALL;
    }

}