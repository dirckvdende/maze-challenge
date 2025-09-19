
export { TestCase, TestGroup, TestSuite };
import { Maze } from "../maze/maze.mjs";

/**
 * A single test case with name and maze to use
 */
type TestCase = {
    name: string,
    maze: Maze,
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