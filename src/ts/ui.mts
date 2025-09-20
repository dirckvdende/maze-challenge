
export { UI };
import { ErrorLevel, Simulator } from "./maze/sim.mjs";
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
    DFS = "Random DFS",
    LOOPED_KRUSKAL = "Looped Kruskal",
    LOOPED_DFS = "Looped Random DFS",
    FULL_GRID = "Full Grid",
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
        () => {
            this.#sim.stepCode = this.#stepCode();
            this.#sim.step();
        });
        let simButton = document.getElementById("sim-button")!;
        simButton.addEventListener("click",
        () => {
            if (this.#sim.isSimulating) {
                simButton.style.backgroundColor = "";
                this.#sim.stopSimulating();
            } else {
                simButton.style.backgroundColor = "red";
                this.#sim.stepCode = this.#stepCode();
                this.#sim.simulate({
                    timeout: 50,
                    stopOnError: true,
                });
            }
        });
        document.getElementById("maze-size-plus-button")!.addEventListener(
        "click", () => {
            if (this.#mazeSize + 2 > MAZE_SIZE_MAX)
                return;
            this.#mazeSize += 2;
            this.#update();
        });
        document.getElementById("maze-size-minus-button")!.addEventListener(
        "click", () => {
            if (this.#mazeSize - 2 < MAZE_SIZE_MIN)
                return;
            this.#mazeSize -= 2;
            this.#update();
        });
        document.getElementById("generator-button")!.addEventListener("click",
        () => {
            let generators = Object.values(Generator);
            let index = generators.indexOf(this.#generator);
            index = (index + 1) % generators.length;
            this.#generator = generators[index];
            this.#update();
        });
    }

    /**
     * Update simulator and display based on saved settings
     */
    #update(): void {
        document.getElementById("sim-button")!.style.backgroundColor = "";
        this.#updateMaze();
        this.#updateStats();
        this.#displayStepErrors();
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
            case Generator.FULL_GRID:
                kruskal(maze, {extraEdgeChance: 1});
                break;
        }
        this.#sim = new Simulator(maze);
        this.#sim.onStep = () => {
            this.#updateStats();
            this.#display.update({onlyPlayer: true});
            this.#displayStepErrors();
            if (this.#sim.hasError())
                (document.getElementById("sim-button")!.style.backgroundColor =
                "");
        };
        this.#sim.onFinish = () => {
            document.getElementById("sim-button")!.style.backgroundColor = "";
        };
        this.#display.maze = maze;
    }

    /**
     * Update the stats/info above the maze
     */
    #updateStats(): void {
        document.getElementById("generator-name")!.innerText = this.#generator;
        document.getElementById("maze-size")!.innerText = (
        `${this.#mazeSize} x ${this.#mazeSize}`);
        document.getElementById("stat-steps")!.innerText = (
        String(this.#sim.stats.steps));
        document.getElementById("stat-memory")!.innerText = (
        String(this.#sim.stats.memoryUsed));
    }

    /**
     * Get the step code entered by the user
     * @returns The code
     */
    #stepCode(): string {
        return (document.getElementById("code") as HTMLInputElement).value;
    }

    /**
     * Display errors/warnings/notes from the last executed step in the example
     * maze
     */
    #displayStepErrors(): void {
        let container = document.getElementById("error-container")!;
        container.innerHTML = "";
        for (let error of this.#sim.stepErrors) {
            let message = document.createElement("div");
            message.classList.add("message");
            let iconContainer = document.createElement("div");
            iconContainer.classList.add("icon");
            let icon = document.createElement("span");
            icon.classList.add("material-symbols-outlined");
            iconContainer.append(icon);
            let text = document.createElement("div");
            text.classList.add("text");
            text.innerText = error.text;
            message.append(iconContainer, text);
            container.append(message);
            switch (error.level) {
                case ErrorLevel.NOTE:
                    message.classList.add("message-info");
                    icon.innerText = "info";
                    break;
                case ErrorLevel.WARNING:
                    message.classList.add("message-warning");
                    icon.innerText = "warning";
                    break;
                case ErrorLevel.ERROR:
                    message.classList.add("message-error");
                    icon.innerText = "error";
                    break;
            }
        }
    }

}