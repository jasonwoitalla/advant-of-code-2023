import { parseLinesFromInput } from '../util/parseInput';

import colors from 'colors';

var height = 0;
var width = 0;

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

    shortestPath(source: number, dest: number = -1): [number, number[]] | undefined {
        let priorityQueue: {weight: number, pos: number, dir: [number, number], straight: number}[] = [];
        let dist = new Array<number>(this.vertices).fill(2147483647);
        let prev = new Array<number>(this.vertices).fill(-1);
        let visited: boolean[] = new Array<boolean>(this.vertices).fill(false);

        priorityQueue.push({weight: 0, pos: source, dir: DOWN, straight: 0});
        priorityQueue.push({weight: 0, pos: source, dir: RIGHT, straight: 0});
        dist[source] = 0;

        while(priorityQueue.length > 0) {
            let current = priorityQueue[0];
            priorityQueue.shift();

            if(visited[current.pos]) continue; // Already visited this node
            visited[current.pos] = true;

            if(current.pos === dest) {
                return [current.weight, prev];
            }

            let [curX, curY] = getCoordinates(current.pos);
            console.log(`Currently at {weight: ${current.weight}, pos: [${curX},${curY}], dir: ${current.dir}, straight: ${current.straight}}`);

            for(let i = 0; i < this.edges[current.pos].length; i++) {
                let [next, weight]: [number, number] = this.edges[current.pos][i];

                let [nextX, nextY] = getCoordinates(next);
                let dir: [number, number] = [nextX - curX, nextY - curY];
                let distance = dist[current.pos] + weight;

                let isStraight = dir[0] === current.dir[0] && dir[1] === current.dir[1];

                console.log(`    Checking {weight: ${distance}, pos: [${nextX},${nextY}], dir: ${dir}, straight: ${current.straight + 1}} is straight=${isStraight}`);

                if(dist[next] > distance && isStraight && current.straight < 2) {
                    dist[next] = distance;
                    prev[next] = current.pos;
                    priorityQueue.push({weight: distance, pos: next, dir: dir, straight: current.straight + 1});
                } else if(dist[next] > distance && !isStraight) {
                    dist[next] = distance;
                    prev[next] = current.pos;
                    priorityQueue.push({weight: distance, pos: next, dir: dir, straight: 0});
                }

                priorityQueue.sort((a, b) => {
                    return a.weight - b.weight;
                });
            }
        }

        if(dest !== -1) {
            return [dist[dest], prev];
        }
    }
}

export async function part1() {
    let grid: string[][] = [];
    await parseLinesFromInput(__dirname + '/example.txt', line => {
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
    let [answer, path]: [number, number[]] = graph.shortestPath(0, bottomRight)!;

    // Draw shortest path on grid
    let tempGrid: string[][] = grid.map((row) => row.map((e) => e));

    let prev = bottomRight;
    while(prev != 0) {
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

function getNumInDirection(path: number[], destPos: number) {
    let pathCopy = path.map((e) => e);

    let currentPos: number = pathCopy.pop()!;
    let [currentX, currentY] = getCoordinates(currentPos);
    let [destX, destY] = getCoordinates(destPos);

    let deltaX = destX - currentX;
    let deltaY = destY - currentY;

    let numberInDirection = 0;
    let prevPos = pathCopy.pop();

    while(prevPos !== undefined) {
        let [lastX, lastY] = getCoordinates(prevPos);

        if(lastX === currentX - deltaX && lastY === currentY - deltaY) {
            currentX = lastX;
            currentY = lastY;
            numberInDirection += 1;
        } else {
            // console.log(`   [${lastX}, ${lastY}] to [${currentX}, ${currentY}] has ${numberInDirection} points in its direction`);
            break;
        }

        prevPos = pathCopy.pop();
    }

    // console.log(`Checking ${currentPos} to ${newPos} has a path of ${JSON.stringify(path)} with ${numberInDirection} in direction ${deltaX}, ${deltaY}`);
    return numberInDirection;
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
 */
