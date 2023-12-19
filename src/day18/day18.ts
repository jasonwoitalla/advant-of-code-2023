import { parseLinesFromInput } from '../util/parseInput';

type Position = [number, number];
type Range = [Position, Position];
const directionMap: Record<string, [number, number]> = {
    'R': [1, 0],
    'D': [0, 1],
    'L': [-1, 0],
    'U': [0, -1]
};

export async function part1() {
    let edges: Range[] = [];

    let minPos: Position = [0, 0]
    let maxPos: Position = [0, 0]

    let position: Position = [0, 0];

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let commands = line.split(' ');
        let dir = directionMap[commands[0]];
        let dist = parseInt(commands[1]);

        let newPosition: Position = [position[0] + (dir[0] * dist), position[1] + (dir[1] * dist)];
        if(newPosition[0] > maxPos[0]) maxPos[0] = newPosition[0];
        if(newPosition[1] > maxPos[1]) maxPos[1] = newPosition[1];
        if(newPosition[0] < minPos[0]) minPos[0] = newPosition[0];
        if(newPosition[1] < minPos[1]) minPos[1] = newPosition[1];

        edges.push([position, newPosition]);
        position = newPosition;
    });

    // Remove overlapping edges
    let newEdges: Range[] = [];
    for(let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let overlap = false;
        for(let j = 0; j < edges.length; j++) {
            if(i === j) continue;
            let otherEdge = edges[j];
            if(edge[0][0] === otherEdge[0][0] && edge[0][1] === otherEdge[0][1] && edge[1][0] === otherEdge[1][0] && edge[1][1] === otherEdge[1][1]) {
                overlap = true;
                break;
            }
        }
        if(!overlap) newEdges.push(edge);
    }

    // Draw edges
    console.log(`Grid starts at ${minPos} and ends at ${maxPos} which is ${maxPos[0] - minPos[0]}x${maxPos[1] - minPos[1]}`);

    let grid: string[][] = [];
    for(let y = 0; y <= maxPos[1] - minPos[1]; y++) {
        grid[y] = [];
        for(let x = 0; x <= maxPos[0] - minPos[0]; x++) {
            grid[y][x] = '.';
        }
    }

    let polygon: Position[] = [];

    let totalMeters = 0;
    newEdges.forEach(edge => {
        let pos = edge[0];
        let newPos = edge[1];

        pos = [pos[0] - minPos[0], pos[1] - minPos[1]];
        newPos = [newPos[0] - minPos[0], newPos[1] - minPos[1]];

        if(pos[0] === newPos[0]) {
            let startY = Math.min(pos[1], newPos[1]);
            let endY = Math.max(pos[1], newPos[1]);

            for(let y = startY; y <= endY; y++) {
                if(grid[y][pos[0]] === '#') continue;
                grid[y][pos[0]] = '#';
                polygon.push([pos[0], y]);
            }
        } else {
            let startX = Math.min(pos[0], newPos[0]);
            let endX = Math.max(pos[0], newPos[0]);

            for(let x = startX; x <= endX; x++) {
                if(grid[pos[1]][x] === '#') continue;
                grid[pos[1]][x] = '#';
                polygon.push([x, pos[1]]);
            }
        }
    });

    // Print
    // for(let y = 0; y <= maxPos[1] - minPos[1]; y++) {
    //     console.log(grid[y].join(''));
    // }

    console.log(`Shoelace area: ${shoelaceArea(newEdges)}`);

    totalMeters = polygon.length;
    return shoelaceArea(newEdges) + (totalMeters / 2) + 1;
}

function shoelaceArea(edges: Range[]) {
    let area = 0;
    for(let range of edges) {
        // Calculate the determinant of the range, add it to the area
        area += (range[0][0] * range[1][1]) - (range[1][0] * range[0][1]);
    }
    return Math.abs(area / 2);
}

const directionHexMap: Record<string, [number, number]> = {
    '0': [1, 0],
    '1': [0, 1],
    '2': [-1, 0],
    '3': [0, -1]
};

export async function part2() {
    let edges: Range[] = [];

    let minPos: Position = [0, 0]
    let maxPos: Position = [0, 0]

    let position: Position = [0, 0];

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let commands = line.split(' ');
        let hex = commands[2].replace('(', '').replace(')', '').replace('#', '0x');
        let dir = directionHexMap[hex[hex.length - 1]];
        hex = hex.substring(0, hex.length - 1);
        let dist = parseInt(hex, 16);

        let newPosition: Position = [position[0] + (dir[0] * dist), position[1] + (dir[1] * dist)];
        if(newPosition[0] > maxPos[0]) maxPos[0] = newPosition[0];
        if(newPosition[1] > maxPos[1]) maxPos[1] = newPosition[1];
        if(newPosition[0] < minPos[0]) minPos[0] = newPosition[0];
        if(newPosition[1] < minPos[1]) minPos[1] = newPosition[1];

        edges.push([position, newPosition]);
        position = newPosition;
    });

    // Remove overlapping edges
    let newEdges: Range[] = [];
    for(let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let overlap = false;
        for(let j = 0; j < edges.length; j++) {
            if(i === j) continue;
            let otherEdge = edges[j];
            if(edge[0][0] === otherEdge[0][0] && edge[0][1] === otherEdge[0][1] && edge[1][0] === otherEdge[1][0] && edge[1][1] === otherEdge[1][1]) {
                overlap = true;
                break;
            }
        }
        if(!overlap) newEdges.push(edge);
    }

    console.log(`Grid starts at ${minPos} and ends at ${maxPos} which is ${maxPos[0] - minPos[0]}x${maxPos[1] - minPos[1]}`);

    let totalMeters = 0;
    newEdges.forEach(edge => {
        let pos = edge[0];
        let newPos = edge[1];

        pos = [pos[0] - minPos[0], pos[1] - minPos[1]];
        newPos = [newPos[0] - minPos[0], newPos[1] - minPos[1]];

        if(pos[0] === newPos[0]) {
            let startY = Math.min(pos[1], newPos[1]);
            let endY = Math.max(pos[1], newPos[1]);
            totalMeters += endY - startY;
        } else {
            let startX = Math.min(pos[0], newPos[0]);
            let endX = Math.max(pos[0], newPos[0]);
            totalMeters += endX - startX;
        }
    });

    console.log(`Shoelace area: ${shoelaceArea(newEdges)}`);
    return shoelaceArea(newEdges) + (totalMeters / 2) + 1;
}

/**
 * Attempted Answers:
 * 
 * 45501 (too low)
 * 47045 (correct)
 */
