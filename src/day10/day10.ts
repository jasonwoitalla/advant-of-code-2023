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

    await parseLinesFromInput(__dirname + '/example.txt', line => {
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
    let total = 0;

    for(let position of cycle) {
        let x = parseInt(position.split(',')[0]);
        let y = parseInt(position.split(',')[1]);

        visited = floodFill(cycle, visited, x, y);
    }

    total += visited.length - cycle.length;

    return total;
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

function isInsideCycle(cycle: string[], x: number, y: number) {
    let inside = false;

    for(let i = 0; i < cycle.length; i += 2) {
        let x1 = parseInt(cycle[i].split(',')[0]);
        let y1 = parseInt(cycle[i].split(',')[1]);
        let x2 = parseInt(cycle[i + 1].split(',')[0]);
        let y2 = parseInt(cycle[i + 1].split(',')[1]);

        

        if((y1 > y) !== (y2 > y) && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
            inside = !inside;
        }
    }

    return inside;
}

function floodFill(cycle: string[], visited: string[], x: number, y: number): string[] {
    // First check that this hasn't been visited and is inside the cycle
    if(visited.includes(`${x},${y}`) || !isInsideCycle(cycle, x, y)) return visited;

    visited.push(`${x},${y}`);
    let queue = [`${x},${y}`];

    while(queue.length > 0) {
        let current = queue.shift()!;
        let x = parseInt(current.split(',')[0]);
        let y = parseInt(current.split(',')[1]);

        if(!visited.includes(`${x},${y - 1}`) && isInsideCycle(cycle, x, y - 1)) {
            visited.push(`${x},${y - 1}`);
            queue.push(`${x},${y - 1}`);
        }

        if(!visited.includes(`${x},${y + 1}`) && isInsideCycle(cycle, x, y + 1)) {
            visited.push(`${x},${y + 1}`);
            queue.push(`${x},${y + 1}`);
        }

        if(!visited.includes(`${x - 1},${y}`) && isInsideCycle(cycle, x - 1, y)) {
            visited.push(`${x - 1},${y}`);
            queue.push(`${x - 1},${y}`);
        }

        if(!visited.includes(`${x + 1},${y}`) && isInsideCycle(cycle, x + 1, y)) {
            visited.push(`${x + 1},${y}`);
            queue.push(`${x + 1},${y}`);
        }
    }

    console.log("Visited points: ");
    console.log(visited.filter(nonCycle => !cycle.includes(nonCycle)));
    return visited;
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
 */
