import { parseLinesFromInput } from '../util/parseInput';

type Position = [number, number];

var gridHeight = 0;
var gridWidth = 0;

export async function part1() {
    let rocks: Position[] = [];
    let cubes: Position[] = [];

    let lineNum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(gridWidth === 0) {
            gridWidth = line.length;
        }

        let characters: string[] = line.split('');
        for(let i = 0; i < characters.length; i++) {
            if(characters[i] === 'O') {
                rocks.push([i, lineNum]);
            } else if(characters[i] === '#') {
                cubes.push([i, lineNum]);
            }
        }
        lineNum += 1;
    });

    gridHeight = lineNum;

    // Keep running update until there is no more movement
    while(update(rocks, cubes, [0, -1]));

    console.log("Grid with no movement:");
    for(let y = 0; y < gridHeight; y++) {
        let line = '';
        for(let x = 0; x < gridWidth; x++) {
            let rockHere = rocks.find((rock) => rock[0] === x && rock[1] === y);
            let cubeHere = cubes.find((cube) => cube[0] === x && cube[1] === y);
            if(rockHere) {
                line += 'O';
            } else if(cubeHere) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
 
    console.log(`Grid height: ${gridHeight}`);
    return calculateWeight(rocks);
}

function canMove(rock: Position, cubes: Position[], rocks: Position[], delta: Position): boolean {
    let newXPosition = rock[0] + delta[0];
    let newYPosition = rock[1] + delta[1];

    if(newYPosition < 0 || newXPosition < 0 || newYPosition > gridHeight - 1 || newXPosition > gridWidth - 1) {
        return false;
    }

    let myCubes = cubes.filter((cube) => cube[0] === newXPosition && cube[1] === newYPosition);
    let myRocks = rocks.filter((r) => r[0] === newXPosition && r[1] === newYPosition);

    return myCubes.length === 0 && myRocks.length === 0;
}

// Moves all rocks that can move up 1 square. Returns true if movement happened
function update(rocks: Position[], cubes: Position[], delta: Position) {
    let numMovements = 0;
    rocks.forEach((rock, index) => {
        if(canMove(rock, cubes, rocks, delta)) {
            rocks[index] = [rock[0] + delta[0], rock[1] + delta[1]];
            numMovements += 1;
        }
    });

    return numMovements !== 0;
}

function calculateWeight(rocks: Position[]): number {
    let weight = 0;
    rocks.forEach((rock) => {
        weight += gridHeight - rock[1];
    });

    return weight;
}

export async function part2() {
    let rocks: Position[] = [];
    let cubes: Position[] = [];

    let lineNum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(gridWidth === 0) {
            gridWidth = line.length;
        }

        let characters: string[] = line.split('');
        for(let i = 0; i < characters.length; i++) {
            if(characters[i] === 'O') {
                rocks.push([i, lineNum]);
            } else if(characters[i] === '#') {
                cubes.push([i, lineNum]);
            }
        }
        lineNum += 1;
    });

    gridHeight = lineNum;

    // Keep running update until there is no more movement
    let numCycles = 500;
    let results = [];

    for(let i = 0; i < numCycles; i++) {
        if(i % 10 === 0) {
            console.log(`Completed ${i} cycles`);
            console.log(JSON.stringify(results));
        }

        // North
        while(update(rocks, cubes, [0, -1]));
        // West
        while(update(rocks, cubes, [-1, 0]));
        // South
        while(update(rocks, cubes, [0, 1]));
        // East
        while(update(rocks, cubes, [1, 0]));

        results.push(calculateWeight(rocks));

        if(results[0] === results[results.length - 1] && i > 0) {
            break;
        }
    }
    
    console.log(`Num results: ${results.length}`)
    console.log(JSON.stringify(results));

    // After a while, the outputs start repeating themselves in a pattern.
    // I manually found the pattern and found that every 34 cycles the answers repeated.
    // I found how many cycles it took for the pattern to start and then manually did this:
    
    // 1000000000 - <cycle pattern starts> % <number of cycles in pattern>

    // That gave me which cycle in the pattern was the answer, in my case it was this:
    // 1000000000 - 107  % 34 = 19 => The 19th answer in the pattern = 90551

    return 0;
}

function printGrid(rocks: Position[], cubes: Position[]) {
    for(let y = 0; y < gridHeight; y++) {
        let line = '';
        for(let x = 0; x < gridWidth; x++) {
            let rockHere = rocks.find((rock) => rock[0] === x && rock[1] === y);
            let cubeHere = cubes.find((cube) => cube[0] === x && cube[1] === y);
            if(rockHere) {
                line += 'O';
            } else if(cubeHere) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 110677 (correct)
 * 
 * Part 2:
 * 90580 (too high)
 * 90560 (too high)
 * 90551
 */
