
export { randomDFS, kruskal };
import { Vec2 } from "../types.mjs";
import { shuffle } from "../util/shuffle.mjs";
import { DisjointUnion } from "../util/disjointunion.mjs";
import { Maze } from "./maze.mjs";

/**
 * Get the neighbours of a (chamber) cell in a maze
 * @param maze The maze the cell is a part of
 * @param cell The cell to get the neighbours of, assumed to be inside the maze
 * @returns The list of neighbours
 */
function neighbours(maze: Maze, cell: Vec2): Vec2[] {
    let diffs: Vec2[] = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0},
    {x: 1, y: 0}];
    let out: Vec2[] = [];
    for (let diff of diffs) {
        let target = {x: cell.x + diff.x, y: cell.y + diff.y};
        if (0 <= target.x && target.x < maze.chamberWidth && 0 <= target.y
        && target.y < maze.chamberHeight)
            out.push(target);
    }
    return out;
}

/**
 * 
 * @param maze The maze object to put the maze in
 * @param options Extra options for the algorithm:
 * - `extraEdgeChance` &mdash; Chance of putting an edge between two cells who
 * have already been visited and recursing. Setting this to higher values will
 * make the algorithm slower, and setting it to 1 will make the algorithm loop
 * forever!
 * @note See https://en.wikipedia.org/wiki/Maze_generation_algorithm
 */
function randomDFS(maze: Maze, options?: {extraEdgeChance?: number}) {
    options ??= {};
    options.extraEdgeChance ??= 0.0;
    maze.fillChambers();
    let visited: boolean[][] = [];
    for (let y = 0; y < maze.chamberHeight; y++) {
        let row: boolean[] = [];
        for (let x = 0; x < maze.chamberWidth; x++)
            row.push(false);
        visited.push(row);
    }
    visited[0][0] = true;
    let stack: Vec2[] = [{x: 0, y: 0}];
    while (stack.length > 0) {
        let cell = stack.pop()
        if (cell == undefined)
            throw new Error("Unexpected undefined cell");
        let nbs = neighbours(maze, cell);
        nbs = nbs.filter((nb) => !visited[nb.y][nb.x]
        || Math.random() < (options.extraEdgeChance ?? 0));
        if (nbs.length == 0)
            continue;
        let nb = nbs[Math.floor(Math.random() * nbs.length)];
        stack.push(cell, nb);
        visited[nb.y][nb.x] = true;
        maze.connectChambers(cell, nb);
    }
    maze.randomStartAndFinish();
}

/**
 * Generate a maze using randomized kruskal
 * @param maze The maze object to put the maze in
 * @param options Extra options for the kruskal algorithm:
 * - `extraEdgeChance` &mdash; Chance of putting an edge between two cells which
 * are already indirectly connected
 * @note See https://en.wikipedia.org/wiki/Maze_generation_algorithm
 */
function kruskal(maze: Maze, options?: {extraEdgeChance?: number}) {
    options ??= {};
    options.extraEdgeChance ??= 0.0;
    maze.fillChambers();
    let edges: [Vec2, Vec2][] = [];
    for (let x = 0; x < maze.chamberWidth; x++) {
        for (let y = 0; y < maze.chamberHeight; y++) {
            if (x + 1 < maze.chamberWidth)
                edges.push([{x, y}, {x: x + 1, y}]);
            if (y + 1 < maze.chamberHeight)
                edges.push([{x, y}, {x, y: y + 1}]);
        }
    }
    shuffle(edges);
    let dsu = new DisjointUnion(maze.chamberWidth * maze.chamberHeight);
    for (let edge of edges) {
        let [start, end] = edge;
        let dsuStart = start.y * maze.chamberWidth + start.x;
        let dsuEnd = end.y * maze.chamberHeight + end.x;
        if (dsu.find(dsuStart) == dsu.find(dsuEnd) && Math.random() >=
        options.extraEdgeChance)
            continue;
        dsu.combine(dsuStart, dsuEnd);
        maze.connectChambers(start, end);
    }
    maze.randomStartAndFinish();
}