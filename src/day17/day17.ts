import { parseLinesFromInput } from '../util/parseInput';
import TinyQueue from 'tinyqueue';
import colors from 'colors';

var height = 0;
var width = 0;

type state = {weight: number, pos: number, dir: [number, number], straight: number};
const RIGHT: [number, number] = [1, 0];
const LEFT: [number, number] = [-1, 0];
const UP: [number, number] = [0, -1];
const DOWN: [number, number] = [0, 1];

class Graph {
    vertices: number;
    edges: [number, number][][];

    constructor(vertices: number) {
        this.vertices = vertices;
        this.edges = new Array<[number, number][]>(vertices);
        for (let i = 0; i < vertices; i++) {
            this.edges[i] = [];
        }
    }

    addEdge(source: number, destination: number, weight: number) {
        this.edges[source].push([destination, weight]);
    }

    shortestPath(source: number, dest: number = -1) {
        let priorityQueue = new TinyQueue<state>([], (a, b) => {
            return a.weight - b.weight;
        });
        let dist: Map<state, number> = new Map<state, number>();
        let prev: Map<state, number> = new Map<state, number>();
        let visited: boolean[] = new Array<boolean>(this.vertices).fill(false);

        let startState = {weight: 0, pos: source, dir: RIGHT, straight: 1};
        dist.set(startState, 0);
        priorityQueue.push(startState);

        let otherStartState = {weight: 0, pos: source, dir: DOWN, straight: 1};
        dist.set(otherStartState, 0);
        priorityQueue.push(otherStartState);

        while(priorityQueue.length > 0) {
            let current = priorityQueue.pop()!;

            if(visited[current.pos]) { // Already visited this node
                console.log(`Already visited ${current.pos}`);
                continue; 
            }
            visited[current.pos] = true;
            // dist[current.pos] = current.weight;

            if(current.pos === dest) {
                return [current.weight, prev];
            }

            let [curX, curY] = getCoordinates(current.pos);
            console.log(`Currently at {weight: ${current.weight}, pos: [${curX},${curY}], dir: ${current.dir}, straight: ${current.straight}}`);

            for(let i = 0; i < this.edges[current.pos].length; i++) {
                let [next, weight]: [number, number] = this.edges[current.pos][i];

                let [nextX, nextY] = getCoordinates(next);
                let dir: [number, number] = [nextX - curX, nextY - curY];
                let distance = dist.get(current)! + weight;

                if(current.dir[0] === -dir[0] && current.dir[1] === -dir[1]) continue; // Don't go back the way we came

                let isStraight = dir[0] === current.dir[0] && dir[1] === current.dir[1];
                let [prevX, prevY] = getCoordinates(current.pos);
                // console.log(`    Checking {weight: ${distance}, pos: [${nextX},${nextY}], dir: ${dir}, straight: ${isStraight ? current.straight + 1: 0}} is straight=${isStraight} previous position=[${prevX}, ${prevY}]`);
                
                let nextState: state = {weight: distance, pos: next, dir: dir, straight: isStraight ? current.straight + 1 : 1};
                let currentDistanceToDest = dist.has(nextState) ? dist.get(nextState)! : Number.MAX_SAFE_INTEGER;

                if(currentDistanceToDest > distance && isStraight && current.straight < 3) {
                    // dist[next] = distance;
                    dist.set(nextState, distance);
                    prev.set(nextState, current.pos);
                    priorityQueue.push(nextState);
                } else if(currentDistanceToDest > distance && !isStraight) {
                    dist.set(nextState, distance);
                    prev.set(nextState, current.pos);
                    priorityQueue.push(nextState);
                }
            }
        }
    }
}

export async function part1() {
    let grid: string[][] = [];
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(height === 0) {
            width = line.length;
        }
        grid.push(line.split(''));

        height += 1;
    });

    // Build graph
    let graph = new Graph(width * height);
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            // Connect to right, left, above and below
            if(x < width - 1) {
                graph.addEdge(y * width + x, y * width + x + 1, parseInt(grid[y][x + 1]));
            }

            if(x > 0) {
                graph.addEdge(y * width + x, y * width + x - 1, parseInt(grid[y][x - 1]));
            }

            if(y < height - 1) {
                graph.addEdge(y * width + x, (y + 1) * width + x, parseInt(grid[y + 1][x]));
            }

            if(y > 0) {
                graph.addEdge(y * width + x, (y - 1) * width + x, parseInt(grid[y - 1][x]));
            }
        }
    }

    // Find shortest path
    let bottomRight = (height - 1) * width + (width - 1);
    let [answer, path]: [any, any] = [0, {}];
    let res = graph.shortestPath(0, bottomRight);
    if(res !== undefined) {
        [answer, path] = res;
    } else {
        return -1;
    }
    console.log(`Shortest path is ${answer}`);

    // Draw shortest path on grid
    let tempGrid: string[][] = grid.map((row) => row.map((e) => e));

    let prev = bottomRight;
    while(prev > 0) {
        let [x, y] = getCoordinates(prev);
        tempGrid[y][x] = colors.bold.red('X');
        prev = path[prev];
    }
    tempGrid[0][0] = colors.bold.red('X');

    for(let y = 0; y < height; y++) {
        console.log(tempGrid[y].join(''));
    }

    return answer;
}

function getCoordinates(num: number): [number, number] {
    let x = num % width;
    let y = Math.floor(num / width);

    return [x, y];
}

export async function part2() {
    await parseLinesFromInput(__dirname + '/example.txt', line => {
    });

    return 0;
}

/**
 * Attempted Answers:
 * 
 * Part 1
 * 759 (too high)
 */
