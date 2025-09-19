
export { getTestSuite };
import { kruskal } from "../maze/generators.mjs";
import { Maze } from "../maze/maze.mjs";
import { TestCase, TestSuite } from "./types.mjs";

const CASES_PER_GROUP = 50;

/**
 * Get a test suite used to evaluate maze code
 */
function getTestSuite(): TestSuite {
    return {
        groups: [{
            name: "Loopless Kruskal",
            cases: Array.from(new Array(CASES_PER_GROUP), (_val, index):
            TestCase => {
                let maze = new Maze(49);
                kruskal(maze);
                return {name: `Loopless Kruskal ${index}`, maze};
            }),
        }],
    };
}