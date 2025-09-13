
export { kruskal };
import { Vec2 } from "../types.mjs";
import { shuffle } from "../util/shuffle.mjs";
import { DisjointUnion } from "../util/disjointunion.mjs";
import { Maze } from "./maze.mjs";

/**
 * Generate a maze using randomized kruskal
 * @param maze The maze object to put the maze in
 * @param options Extra options for the kruskal algorithm
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