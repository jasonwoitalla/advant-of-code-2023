import { parseLinesFromInput } from '../util/parseInput';
import { Graph } from '../util/Graph';

export async function part1() {
    let grid: string[][] = [];
    let graph = new Graph<string>((a, b) => a.localeCompare(b));

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        grid.push(line.split(''));
    });

    // Step 1: Add all positions to the graph
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y].length; x++) {
            graph.addNode(`${x},${y}`);
        }
    }

    // Step 2: Add all the edges to the graph
    let startingPosition: string | undefined;
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y].length; x++) {
            if(grid[y][x] === '|') { // connect north and south
                addNorthEdge(graph, x, y);
                addSouthEdge(graph, x, y);
            } else if(grid[y][x] === '-') { // connect east and west
                addEastEdge(graph, x, y);
                addWestEdge(graph, x, y);
            } else if(grid[y][x] === 'L') { // connect north and east
                addNorthEdge(graph, x, y);
                addEastEdge(graph, x, y);
            } else if(grid[y][x] === 'J') { // connect north and west
                addNorthEdge(graph, x, y);
                addWestEdge(graph, x, y);
            } else if(grid[y][x] === '7') { // connect south and west
                addSouthEdge(graph, x, y);
                addWestEdge(graph, x, y);
            } else if(grid[y][x] === 'F') { // connect south and east
                addSouthEdge(graph, x, y);
                addEastEdge(graph, x, y);
            } else if(grid[y][x] === 'S') { // starting position
                startingPosition = `${x},${y}`;
                addNorthEdge(graph, x, y);
                addSouthEdge(graph, x, y);
                addEastEdge(graph, x, y);
                addWestEdge(graph, x, y);
            }
        }
    }
    graph.removeOneWayEdges();

    // Step 3: Find furthest position from the starting position
    if(startingPosition === undefined) throw new Error('No starting position found');

    let cycle = dfs(graph, startingPosition);
    return cycle.length / 2;
}

export async function part2() {
    let grid: string[][] = [];
    let graph = new Graph<string>((a, b) => a.localeCompare(b));

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        grid.push(line.split(''));
    });

    // Step 1: Add all positions to the graph
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y].length; x++) {
            graph.addNode(`${x},${y}`);
        }
    }

    // Step 2: Add all the edges to the graph
    let startingPosition: string | undefined;
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y].length; x++) {
            if(grid[y][x] === '|') { // connect north and south
                addNorthEdge(graph, x, y);
                addSouthEdge(graph, x, y);
            } else if(grid[y][x] === '-') { // connect east and west
                addEastEdge(graph, x, y);
                addWestEdge(graph, x, y);
            } else if(grid[y][x] === 'L') { // connect north and east
                addNorthEdge(graph, x, y);
                addEastEdge(graph, x, y);
            } else if(grid[y][x] === 'J') { // connect north and west
                addNorthEdge(graph, x, y);
                addWestEdge(graph, x, y);
            } else if(grid[y][x] === '7') { // connect south and west
                addSouthEdge(graph, x, y);
                addWestEdge(graph, x, y);
            } else if(grid[y][x] === 'F') { // connect south and east
                addSouthEdge(graph, x, y);
                addEastEdge(graph, x, y);
            } else if(grid[y][x] === 'S') { // starting position
                startingPosition = `${x},${y}`;
                addNorthEdge(graph, x, y);
                addSouthEdge(graph, x, y);
                addEastEdge(graph, x, y);
                addWestEdge(graph, x, y);
            }
        }
    }
    graph.removeOneWayEdges();

    // Step 3: Find furthest position from the starting position
    if(startingPosition === undefined) throw new Error('No starting position found');

    let cycle = dfs(graph, startingPosition);

    // Find the tiles that are inside the cycle
    let visited: string[] = [];
    let count = 0;

    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[0].length; x++) {
            if(isInsideCycle(grid, cycle, x, y)) {
                count += 1;
            }
        }
    }

    return count;
}

function addNorthEdge(graph: Graph<string>, x: number, y: number) {
    if(y === 0) return;

    graph.addEdge(`${x},${y}`, `${x},${y - 1}`);
}

function addSouthEdge(graph: Graph<string>, x: number, y: number) {
    graph.addEdge(`${x},${y}`, `${x},${y + 1}`);
}

function addEastEdge(graph: Graph<string>, x: number, y: number) {
    graph.addEdge(`${x},${y}`, `${x + 1},${y}`);
}

function addWestEdge(graph: Graph<string>, x: number, y: number) {
    if(x === 0) return;

    graph.addEdge(`${x},${y}`, `${x - 1},${y}`);
}

function dfs(graph: Graph<string>, start: string) {
    let neighbors = graph.nodes.get(start)?.adjacent;
    let nextNode = neighbors![0].data;

    let stack: string[] = [nextNode];
    let path: string[] = [start, nextNode];
    let visited: string[] = [start, nextNode];

    while(stack.length > 0) {
        let currentNode = stack.pop()!;

        let neighbors = graph.nodes.get(currentNode)?.adjacent;
        for(let neighbor of neighbors!) {
            if(neighbor.data === start && path.length > 4) {
                return path;
            }

            if(!visited.includes(neighbor.data)) {
                visited.push(neighbor.data);
                stack.push(neighbor.data);
                path.push(neighbor.data);
            }
        }
    }

    return path;
}

function isInsideCycle(grid: string[][], cycle: string[], x: number, y: number) {
    if(x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) {
        return false;
    }

    if(cycle.includes(`${x},${y}`)) return false;

    let crosses = 0;
    let x2 = x;
    let y2 = y;

    while(x2 < grid[0].length && y2 < grid.length) {
        let char = grid[y2][x2];
        if(cycle.includes(`${x2},${y2}`) && char != 'L' && char != '7') {
            crosses += 1;
        }

        x2 += 1;
        y2 += 1;
    }

    // if(crosses % 2 == 1) {
    //     console.log(`[${x},${y}] is inside the cycle`);
    // }

    return crosses % 2 == 1;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 9700 (too high)
 * 9699 (too high)
 * 83 (incorrect)
 * 6927 (correct)
 * 
 * Part 2:
 * 1593 (too high)
 * 467 (correct)
 */
