
export { MazeDisplay };
import { Maze, MazeSquare } from "./maze.mjs";

/**
 * Class used to display a matrix in a container
 */
class MazeDisplay {

    // Container of the maze
    #container: HTMLElement;
    // The maze to display. Nothing is displayed if this is undefined
    maze: Maze | undefined;

    /**
     * Constructor
     * @param container The container to display the maze in
     * @param maze The maze to display, or undefined to display no maze
     */
    constructor(container: HTMLElement, maze?: Maze) {
        this.#container = container;
        this.maze = maze;
    }

    /**
     * Update the maze display
     * @param options Options for updating:
     * - onlyPlayer: Only update the player position, not the rest of the maze.
     */
    update(options?: {onlyPlayer?: boolean}): void {
        if (this.maze == undefined) {
            this.#container.innerHTML = "";
            return;
        }
        options ??= {};
        if (!(options.onlyPlayer ?? false)) {
            this.#container.innerHTML = "";
            this.#addMazeGrid();
        }
        let playerElement = (this.#container.querySelector(".player") as
        HTMLElement);
        if (playerElement == null) {
            playerElement = document.createElement("div");
            playerElement.classList.add("player");
            this.#container.append(playerElement);
        }
        this.#updatePlayerPosition(playerElement);
    }

    /**
     * Add the maze grid to the container
     */
    #addMazeGrid(): void {
        if (this.maze == undefined)
            throw new Error("Cannot add maze grid of undefined maze");
        for (let i = 0; i < this.maze.height; i++) {
            let row = document.createElement("div");
            row.classList.add("row");
            this.#container.append(row);
            for (let j = 0; j < this.maze.width; j++) {
                let cell = document.createElement("div");
                cell.classList.add("cell");
                let color = "purple";
                switch (this.maze.getCell({x: j, y: i})) {
                    case MazeSquare.EMPTY: color = "transparent"; break;
                    case MazeSquare.WALL: color = "#f2f2f2"; break;
                    case MazeSquare.FINISH: color = "yellow"; break;
                }
                cell.style.backgroundColor = color;
                row.append(cell);
            }
        }
    }

    /**
     * Update the position of the player
     * @param playerElement The element to move
     */
    #updatePlayerPosition(playerElement: HTMLElement): void {
        if (this.maze == undefined)
            throw new Error("Cannot move player on undefined maze");
        playerElement.style.left = `${this.maze.player.x + 0.5}em`;
        playerElement.style.top = `${this.maze.player.y + 0.5}em`;
    }

}