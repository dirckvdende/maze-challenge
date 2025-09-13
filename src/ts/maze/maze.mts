
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