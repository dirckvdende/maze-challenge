
export { TestCase, TestGroup, TestSuite };
import { Maze } from "../maze/maze.mjs";

/**
 * A single test case with name and maze to use. Alternative a function that
 * returns a maze can be assigned, which allows the repeat property to be used
 * to run the test case multiple times, with different mazes
 */
type TestCase = {
    name: string,
    maze: Maze | (() => Maze),
    repeat?: number,
};

/**
 * A group of tests, with a name and a list of test cases
 */
type TestGroup = {
    name: string,
    cases: TestCase[],
};

/**
 * A suite of test groups
 */
type TestSuite = {
    groups: TestGroup[];
};