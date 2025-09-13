
import { Maze } from "./maze/maze.mjs";
import { MazeDisplay } from "./maze/display.mjs";

let maze = new Maze(10, 10);
let display = new MazeDisplay(document.getElementById("maze")!, maze);
display.update();