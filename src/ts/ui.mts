
export { UI };
import { Simulator } from "./maze/sim.mjs";
import { getTestSuite } from "./tests/test_suite.mjs";
import { TestPopup } from "./tests/popup.mjs";
import { Maze } from "./maze/maze.mjs";
import { MazeDisplay } from "./maze/display.mjs";
import { kruskal, randomDFS } from "./maze/generators.mjs";

// Min/max maze size
const MAZE_SIZE_MIN = 5;
const MAZE_SIZE_MAX = 51;

/**
 * Maze generator
 */
enum Generator {
    KRUSKAL = "Kruskal",
    LOOPED_KRUSKAL = "Looped Kruskal",
    DFS = "Random DFS",
    LOOPED_DFS = "Looped Random DFS",
};

/**
 * General UI controller for everything on the screen
 */
class UI {

    // Currently loaded example maze/simulator
    #sim: Simulator;
    // Currently selected maze generation algorithm
    #generator: Generator;
    // Maze display
    #display: MazeDisplay;
    // Maze size
    #mazeSize: number;

    /**
     * Constructor
     */
    constructor() {
        let dummyMaze = new Maze(1);
        this.#sim = new Simulator(dummyMaze);
        this.#generator = Generator.KRUSKAL;
        this.#display = new MazeDisplay(document.getElementById("maze")!);
        this.#mazeSize = 21;
        this.#initButtons();
        this.#update();
    }

    /**
     * Initialize buttons below the example maze
     */
    #initButtons(): void {
        document.getElementById("tests-button")!.addEventListener("click",
        () => {
            let popup = new TestPopup(getTestSuite());
            popup.start();
        });
        document.getElementById("regenerate-button")!.addEventListener("click",
        () => this.#update());
        document.getElementById("step-button")!.addEventListener("click",
        () => this.#sim.step());
        let simButton = document.getElementById("sim-button")!;
        simButton.addEventListener("click",
        () => {
            if (this.#sim.isSimulating) {
                simButton.style.backgroundColor = "";
                this.#sim.stopSimulating();
            } else {
                simButton.style.backgroundColor = "red";
                this.#sim.simulate({
                    timeout: 50,
                    stopOnError: true,
                });
            }
        });
    }

    /**
     * Update simulator and display based on saved settings
     */
    #update(): void {
        this.#updateMaze();
        this.#updateStats();
        this.#display.update();
    }

    /**
     * Update the stored maze, simulator and maze display to reflect the current
     * settings. This regenerates the maze
     */
    #updateMaze(): void {
        let maze = new Maze(this.#mazeSize);
        switch (this.#generator) {
            case Generator.KRUSKAL:
                kruskal(maze);
                break;
            case Generator.LOOPED_KRUSKAL:
                kruskal(maze, {extraEdgeChance: .1});
                break;
            case Generator.DFS:
                randomDFS(maze);
                break;
            case Generator.LOOPED_DFS:
                randomDFS(maze, {extraEdgeChance: .03});
                break;
        }
        this.#sim = new Simulator(maze);
        this.#sim.onStep = () => this.#updateStats();
        this.#display.maze = maze;
    }

    /**
     * Update the stats/info above the maze
     */
    #updateStats(): void {
        document.getElementById("generator-name")!.innerText = this.#generator;
        document.getElementById("stat-steps")!.innerText = (
        String(this.#sim.stats.steps));
        document.getElementById("stat-memory")!.innerText = (
        String(this.#sim.stats.memoryUsed));
    }

}