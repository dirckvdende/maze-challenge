
import { Maze } from "./maze/maze.mjs";
import { MazeDisplay } from "./maze/display.mjs";
import { kruskal } from "./maze/generators.mjs";

let maze = new Maze(25, 25);
kruskal(maze);
let display = new MazeDisplay(document.getElementById("maze")!, maze);
display.update();