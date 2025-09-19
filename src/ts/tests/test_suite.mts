
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
                let size = Math.floor(index / 2) * 2 + 3;
                let maze = new Maze(size);
                kruskal(maze);
                return {name: `Loopless Kruskal ${size} x ${size}`, maze};
            }),
        }, {
            name: "Looped Kruskal 0.1",
            cases: Array.from(new Array(CASES_PER_GROUP), (_val, index):
            TestCase => {
                let size = Math.floor(index / 2) * 2 + 3;
                let maze = new Maze(size);
                kruskal(maze, {
                    extraEdgeChance: .1,
                });
                return {name: `Loopless Kruskal ${size} x ${size}`, maze};
            })
        }],
    };
}