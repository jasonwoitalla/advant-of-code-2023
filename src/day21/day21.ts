import { parseLinesFromInput } from '../util/parseInput';

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    mod(point: Point) {
        return new Point(((this.x % point.x) + point.x) % point.x, ((this.y % point.y) + point.y) % point.y);
    }
}

export async function part1() {
    let grid: string[][] = [];
    let startingPoint: Point;

    let lineNum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        grid.push(line.split(''));
        for(let i = 0; i < line.length; i++) {
            if(line[i] === 'S') {
                startingPoint = new Point(i, lineNum);
            }
        }
        lineNum++;
    });

    let numSteps = 64;
    return bfs(grid, startingPoint!, numSteps - 1, getNeighbors);
}

function bfs(grid: string[][], startingPoint: Point, numSteps: number, findNeighbors = getNeighbors) {
    let gridCopy = grid.map((row) => row.map((e) => e));
    let queue: [Point, number][] = [[startingPoint, 0]];
    let visited: Set<string> = new Set();
    visited.add(hashStep(startingPoint, 0));

    while(queue.length > 0) {
        let [curr, steps] = queue.shift()!;
        if(steps >= numSteps) {
            break;
        }

        let neighbors = findNeighbors(curr, grid);

        for(let neighbor of neighbors) {
            let hash = hashStep(neighbor, steps + 1);
            if(!visited.has(hash)) {
                // gridCopy[neighbor.y][neighbor.x] = 'O';
                queue.push([neighbor, steps + 1]);
                visited.add(hash);
            }
        }
    }

    let canVisit = 0;
    visited.forEach((hash) => {
        let [x, y, steps] = hash.split(',').map((e) => parseInt(e));
        if(steps === numSteps) {
            let point = new Point(x, y);
            let neighbors = findNeighbors(point, grid);
            for(let neighbor of neighbors) {
                if(gridCopy[neighbor.y][neighbor.x] !== 'O') {
                    canVisit++;
                }
                gridCopy[neighbor.y][neighbor.x] = 'O';
            }
        }
    });

    // gridCopy[startingPoint.y][startingPoint.x] = 'S';
    for(let y = 0; y < gridCopy.length; y++) {
        console.log(gridCopy[y].join(''));
    }

    return canVisit;
}

function hashStep(point: Point, numSteps: number) {
    return `${point.x},${point.y},${numSteps}`;
}

function getNeighbors(point: Point, grid: string[][]) {
    let neighbors: Point[] = [];
    if(point.y > 0 && grid[point.y - 1][point.x] !== '#') {
        neighbors.push(new Point(point.x, point.y - 1));
    }
    if(point.y < grid.length - 1 && grid[point.y + 1][point.x] !== '#') {
        neighbors.push(new Point(point.x, point.y + 1));
    }
    if(point.x > 0 && grid[point.y][point.x - 1] !== '#') {
        neighbors.push(new Point(point.x - 1, point.y));
    }
    if(point.x < grid[0].length - 1 && grid[point.y][point.x + 1] !== '#') {
        neighbors.push(new Point(point.x + 1, point.y));
    }

    return neighbors;
}

export async function part2() {
    let grid: string[][] = [];
    let startingPoint: Point;

    let lineNum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        grid.push(line.split(''));
        for(let i = 0; i < line.length; i++) {
            if(line[i] === 'S') {
                startingPoint = new Point(i, lineNum);
            }
        }
        lineNum++;
    });

    let numSteps = 26501365;
    return bfs(grid, startingPoint!, numSteps - 1, getLoopNeighbors);
}

function getLoopNeighbors(point: Point, grid: string[][]) {
    let neighbors: Point[] = [];
    let size = new Point(grid[0].length, grid.length);
    
    let north = new Point(point.x, (point.y - 1));
    // console.log(`Checking north: ${north.x}, ${north.y}`);
    north = north.mod(size);
    // console.log(`Checking north: ${north.x}, ${north.y}`);
    // console.log();
    if(grid[north.y][north.x] !== '#') {
        neighbors.push(north);
    }

    let south = new Point(point.x, (point.y + 1));
    south = south.mod(size);
    if(grid[south.y][south.x] !== '#') {
        neighbors.push(south);
    }
    
    let west = new Point((point.x - 1), point.y);
    west = west.mod(size);
    if(grid[west.y][west.x] !== '#') {
        neighbors.push(west);
    }

    let east = new Point((point.x + 1), point.y);
    east = east.mod(size);
    if(grid[east.y][east.x] !== '#') {
        neighbors.push(east);
    }

    return neighbors;
}

/**
 * Attempted Answers:
 * 
 */
