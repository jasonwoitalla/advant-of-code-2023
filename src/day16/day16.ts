import { Console } from 'console';
import { parseLinesFromInput } from '../util/parseInput';

type Range = {
    start: [number, number];
    end: [number, number];
}

// a tuple that represents the direction and position of a beam
type Beam = {
    dir: [number, number];
    pos: [number, number];
    ranges: Range[];
}

var width = 0;
var height = 0;
var lastCovered = 0;
var coveredTiles: Set<string> = new Set();

export async function part1() {
    let grid: string[][] = [];

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(height === 0) {
            width = line.length;
        }

        grid.push(line.split(''));
        height += 1;
    });

    var beams: Beam[] = [{ dir: [1, 0], pos: [0, 0], ranges: [] }];
    coveredTiles.add('0,0');

    // Reflections
    if(grid[beams[0].pos[1]][beams[0].pos[0]] === '/') {
        beams[0].dir = [-beams[0].dir[1], -beams[0].dir[0]];
    } else if(grid[beams[0].pos[1]][beams[0].pos[0]] === '\\') {
        beams[0].dir = [beams[0].dir[1], beams[0].dir[0]];
    }

    let process = true;
    let beamsToRemove: number[] = [];
    while(process) {
        [process, beamsToRemove] = processBeams(beams, grid);
        let oldLength = beams.length;

        // Find and remove any overlapping beams
        for(let beam of beams) {
            for(let otherBeam of beams) {
                if(beam === otherBeam) {
                    continue;
                }

                if(beam.pos[0] === otherBeam.pos[0] && beam.pos[1] === otherBeam.pos[1] && 
                    beam.dir[0] === otherBeam.dir[0] && beam.dir[1] === otherBeam.dir[1]) {
                    beamsToRemove.push(beams.indexOf(otherBeam));
                }
            }
        }

        beamsToRemove.sort((a, b) => b - a);
        for(let i = 0; i < beamsToRemove.length; i++) {
            beams.splice(beamsToRemove[i], 1);
        }

        // await delay(1000);
        // console.log('-------------------');
        // drawGrid(grid);
        // console.log(`Length was ${oldLength}`);
        // console.log(`Removed ${beamsToRemove.length} beams`);
        // console.log(`Processing ${beams.length} beams`);
        // console.log('');
    }

    // drawGrid(grid);

    let numTiles = 0;
    for(let tile of coveredTiles) {
        let parts = tile.split(',');
        let x = parseInt(parts[0]);
        let y = parseInt(parts[1]);
        if(x >= 0 && x < width && y >= 0 && y < height) {
            numTiles += 1;
        }
    }

    return numTiles;
}

function drawGrid(grid: string[][]) {
    let drawGrid: string[][] = grid.map(row => row.map(cell => cell));
    let numTiles = 0;
    for(let tile of coveredTiles) {
        let parts = tile.split(',');
        let x = parseInt(parts[0]);
        let y = parseInt(parts[1]);
        if(x >= 0 && x < width && y >= 0 && y < height) {
            drawGrid[y][x] = 'X';
            numTiles += 1;
        }
    }

    // Print out the grid
    for(let y = 0; y < height; y++) {
        let line = '';
        for(let x = 0; x < width; x++) {
            line += drawGrid[y][x];
        }
        console.log(line);
    }
    console.log(`Covered ${numTiles} tiles`);
}

function processBeams(beams: Beam[], grid: string[][]): [boolean, number[]] {
    // console.log(`Processing ${beams.length} beams`);
    let beamsToRemove: number[] = [];
    for(let beam of beams) {
        if(beam.pos[0] < 0 || beam.pos[0] >= width || beam.pos[1] < 0 || beam.pos[1] >= height) { // beam has left the grid
            beamsToRemove.push(beams.indexOf(beam));
            continue;
        }

        if(grid[beam.pos[1]][beam.pos[0]] === '/' || grid[beam.pos[1]][beam.pos[0]] === '\\') {
            beam.pos = [beam.pos[0] + beam.dir[0], beam.pos[1] + beam.dir[1]];
        }

        let range: Range = { start: [beam.pos[0], beam.pos[1]], end: [0, 0] };

        // console.log(`Processing beam at ${beam.pos[0]},${beam.pos[1]} in direction ${beam.dir[0]},${beam.dir[1]}`);
        // console.log(`     With symbol ${grid[beam.pos[1]][beam.pos[0]]}`);

        while(canMove(beam.pos, beam.dir, grid)) {
            beam.pos = [beam.pos[0] + beam.dir[0], beam.pos[1] + beam.dir[1]];
        }

        if(beam.pos[0] < 0 || beam.pos[0] >= width || beam.pos[1] < 0 || beam.pos[1] >= height) { // beam has left the grid
            range.end = [beam.pos[0], beam.pos[1]];
            beam.ranges.push(range);
            let startX = Math.min(range.start[0], range.end[0]);
            let endX = Math.max(range.start[0], range.end[0]);
            let startY = Math.min(range.start[1], range.end[1]);
            let endY = Math.max(range.start[1], range.end[1]);

            for(let x = startX; x <= endX; x++) {
                for(let y = startY; y <= endY; y++) {
                    coveredTiles.add(`${x},${y}`);
                }
            }

            beamsToRemove.push(beams.indexOf(beam));
            continue;
        }

        let isVertical = beam.dir[0] === 0;
        if(isVertical && grid[beam.pos[1]][beam.pos[0]] === '-') { // split beam
            // console.log(`Splitting horizontally beam at ${beam.pos[0]},${beam.pos[1]}`);
            beam.dir = [1, 0];
            beams.push({ dir: [-1, 0], pos: [beam.pos[0], beam.pos[1]], ranges: [] });
        } else if(!isVertical && grid[beam.pos[1]][beam.pos[0]] === '|') { // split beam
            // console.log(`Splitting vertically beam at ${beam.pos[0]},${beam.pos[1]}`);
            beam.dir = [0, 1];
            beams.push({ dir: [0, -1], pos: [beam.pos[0], beam.pos[1]], ranges: [] });
        }

        // Reflections
        if(grid[beam.pos[1]][beam.pos[0]] === '/') {
            beam.dir = [-beam.dir[1], -beam.dir[0]];
        } else if(grid[beam.pos[1]][beam.pos[0]] === '\\') {
            beam.dir = [beam.dir[1], beam.dir[0]];
        }

        range.end = [beam.pos[0], beam.pos[1]];
        beam.ranges.push(range);

        let startX = Math.min(range.start[0], range.end[0]);
        let endX = Math.max(range.start[0], range.end[0]);
        let startY = Math.min(range.start[1], range.end[1]);
        let endY = Math.max(range.start[1], range.end[1]);

        for(let x = startX; x <= endX; x++) {
            for(let y = startY; y <= endY; y++) {
                coveredTiles.add(`${x},${y}`);
            }
        }
    }

    if(coveredTiles.size === lastCovered) { // end condition
        return [false, beamsToRemove];
    }

    lastCovered = coveredTiles.size;
    return [true, beamsToRemove];
}

function canMove(pos: [number, number], dir: [number, number], grid: string[][]) {
    // console.log(`Checking if can move from ${pos[0]},${pos[1]} in direction ${dir[0]},${dir[1]}`);
    let isVertical = dir[0] === 0;
    let splitterSymbol = isVertical ? '-' : '|';

    return pos[0] >= 0 && pos[0] < width && pos[1] >= 0 && pos[1] < height && grid[pos[1]][pos[0]] !== splitterSymbol
        && grid[pos[1]][pos[0]] !== '/' && grid[pos[1]][pos[0]] !== '\\';
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export async function part2() {
    let grid: string[][] = [];

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(height === 0) {
            width = line.length;
        }

        grid.push(line.split(''));
        height += 1;
    });

    let answers: number[] = [];
    let startingDir: [number, number] = [0, 0];

    // From the top row going south
    startingDir = [0, 1];
    for(let x = 0; x < width; x++) {
        answers.push(findNumTiles(grid, [x, 0], startingDir));
    }
    console.log('Done with top row');

    // From the bottom row going north
    startingDir = [0, -1];
    for(let x = 0; x < width; x++) {
        answers.push(findNumTiles(grid, [x, height - 1], startingDir));
    }
    console.log('Done with bottom row');

    // From the left column going east
    startingDir = [1, 0];
    for(let y = 0; y < height; y++) {
        answers.push(findNumTiles(grid, [0, y], startingDir));
    }
    console.log('Done with left column');

    // From the right column going west
    startingDir = [-1, 0];
    for(let y = 0; y < height; y++) {
        answers.push(findNumTiles(grid, [width - 1, y], startingDir));
    }
    console.log('Done with right column');

    return Math.max(...answers);
}

function findNumTiles(grid: string[][], startPos: [number, number], startDir: [number, number]) {
    var beams: Beam[] = [{ dir: startDir, pos: startPos, ranges: [] }];

    coveredTiles = new Set();
    coveredTiles.add(`${startPos[0]},${startPos[1]}`);

    // Reflections
    if(grid[beams[0].pos[1]][beams[0].pos[0]] === '/') {
        beams[0].dir = [-beams[0].dir[1], -beams[0].dir[0]];
    } else if(grid[beams[0].pos[1]][beams[0].pos[0]] === '\\') {
        beams[0].dir = [beams[0].dir[1], beams[0].dir[0]];
    }

    let process = true;
    let beamsToRemove: number[] = [];
    while(process) {
        [process, beamsToRemove] = processBeams(beams, grid);

        // Find and remove any overlapping beams
        for(let beam of beams) {
            for(let otherBeam of beams) {
                if(beam === otherBeam) {
                    continue;
                }

                if(beam.pos[0] === otherBeam.pos[0] && beam.pos[1] === otherBeam.pos[1] && 
                    beam.dir[0] === otherBeam.dir[0] && beam.dir[1] === otherBeam.dir[1]) {
                    beamsToRemove.push(beams.indexOf(otherBeam));
                }
            }
        }

        beamsToRemove.sort((a, b) => b - a);
        for(let i = 0; i < beamsToRemove.length; i++) {
            beams.splice(beamsToRemove[i], 1);
        }

        // await delay(1000);
        // console.log('-------------------');
        // drawGrid(grid);
        // console.log(`Length was ${oldLength}`);
        // console.log(`Removed ${beamsToRemove.length} beams`);
        // console.log(`Processing ${beams.length} beams`);
        // console.log('');
    }

    // drawGrid(grid);

    let numTiles = 0;
    for(let tile of coveredTiles) {
        let parts = tile.split(',');
        let x = parseInt(parts[0]);
        let y = parseInt(parts[1]);
        if(x >= 0 && x < width && y >= 0 && y < height) {
            numTiles += 1;
        }
    }

    return numTiles;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 6920 (too low)
 * 
 */
