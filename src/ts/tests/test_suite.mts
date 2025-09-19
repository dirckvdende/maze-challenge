
export { getTestSuite };
import { kruskal, randomDFS } from "../maze/generators.mjs";
import { Maze } from "../maze/maze.mjs";
import { TestCase, TestGroup, TestSuite } from "./types.mjs";

const CASES_PER_GROUP = 50;

/**
 * Create an array with values given by a certain function
 * @param size The size of the array
 * @param func The function returning the value
 * @returns An array filled with a value returned from an array
 */
function arrayFromFunction<T>(size: number, func: (() => T)): T[] {
    let arr: T[] = [];
    for (let i = 0; i < size; i++)
        arr.push(func());
    return arr;
}

/**
 * Get a test suite used to evaluate maze code
 */
function getTestSuite(): TestSuite {
    let groups: TestGroup[] = [];
    let generators = [
        {name: "Kruskal", function: kruskal},
        {name: "random DFS", function: randomDFS},
    ];
    // Loopless
    for (let generator of generators)
        for (let size of [25, 51])
            groups.push({
                name: `Loopless ${generator.name} ${size} x ${size}`,
                cases: arrayFromFunction(CASES_PER_GROUP, (): TestCase => {
                    let maze = new Maze(size);
                    generator.function(maze);
                    return {name: `Loopless ${generator.name}`, maze};
                }),
            });
    // Looped
    for (let p of [.01, .1, .5]) for (let size of [25, 51])
        groups.push({
            name: `Looped Kruskal ${size} x ${size}; p = ${p.toFixed(2)}`,
            cases: arrayFromFunction(CASES_PER_GROUP, (): TestCase => {
                let maze = new Maze(size);
                kruskal(maze, {extraEdgeChance: p});
                return {name: "Looped Kruskal", maze};
            }),
        });
    for (let p of [.01, .03, .1]) for (let size of [25, 51])
        groups.push({
            name: `Looped random DFS ${size} x ${size}; p = ${p.toFixed(2)}`,
            cases: arrayFromFunction(CASES_PER_GROUP, (): TestCase => {
                let maze = new Maze(size);
                randomDFS(maze, {extraEdgeChance: p});
                return {name: "Looped random DFS", maze};
            }),
        });
    groups.push({
        name: "Full grid",
        cases: [(() => {
            let maze = new Maze(51);
            kruskal(maze, {extraEdgeChance: 1});
            return {name: "Full grid", maze};
        })()],
    });
    return {groups};
}