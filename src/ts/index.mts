
import { Maze } from "./maze/maze.mjs";
import { MazeDisplay } from "./maze/display.mjs";
import { kruskal, randomDFS } from "./maze/generators.mjs";
import { TestPopup } from "./tests/popup.mjs";
import { TestCase } from "./tests/types.mjs";

let maze = new Maze(21);
let display = new MazeDisplay(document.getElementById("maze")!, maze);

randomDFS(maze, {
    extraEdgeChance: 0,
});
display.update();

let testCases: TestCase[] = [];
for (let i = 0; i < 100; i++) {
    let maze = new Maze(25);
    kruskal(maze, {extraEdgeChance: .02});
    testCases.push({name: "Maze", maze});
}
document.getElementById("step-button")!.addEventListener("click", () => {
    let popup = new TestPopup({
        groups: [{
            name: "Test 1",
            cases: testCases,
        }],
    });
    popup.start();
});