
import { Maze } from "./maze/maze.mjs";
import { MazeDisplay } from "./maze/display.mjs";
import { getTestSuite } from "./tests/test_suite.mjs";
import { TestPopup } from "./tests/popup.mjs";
import { randomDFS } from "./maze/generators.mjs";

let maze = new Maze(21);
let display = new MazeDisplay(document.getElementById("maze")!, maze);

randomDFS(maze, {
    extraEdgeChance: 0,
});
display.update();

document.getElementById("step-button")!.addEventListener("click", () => {
    let popup = new TestPopup(getTestSuite());
    popup.start();
});