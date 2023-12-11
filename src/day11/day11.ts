import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let grid: string[][] = [];

    let galaxies: [number, number][] = [];

    let rowExpansion: number[] = [];
    let columnExpansion: number[] = [];

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        grid.push(line.split(''));

        if(!line.includes('#'))
            rowExpansion.push(grid.length);
    });

    // Find column expansions
    for(let x = 0; x < grid[0].length; x++) {
        let hasGalaxy = false;
        for(let y = 0; y < grid.length; y++) {
            if(grid[y][x] == '#') {
                hasGalaxy = true;
            }
        }

        if(!hasGalaxy) {
            columnExpansion.push(x);
        }
    }

    columnExpansion.forEach((column, index) => {
        insertBlankColumn(grid, column + index, '.');
    });

    let blankRow = Array(grid[0].length);
    blankRow = blankRow.fill('.');
    rowExpansion.forEach((row, index) => {
        grid.splice(row + index, 0, blankRow);
    });

    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[0].length; x++) {
            if(grid[y][x] === '#') {
                galaxies.push([y, x]);
            }
        }
    }

    let sum = 0;
    for(let i = 0; i < galaxies.length; i++) {
        for(let j = i+1; j < galaxies.length; j++) {
            if(i == j) continue;

            // console.log(`Distance from ${i+1}:${galaxies[i]} to ${j+1}:${galaxies[j]} is ${manhattanDistance(galaxies[i], galaxies[j])}`);
            sum += manhattanDistance(galaxies[i], galaxies[j]);
        }
    }

    return sum;
}

function insertBlankColumn(grid: string[][], column: number, character: string) {
    for(let y = 0; y < grid.length; y++) {
        grid[y].splice(column, 0, character);
    }
}

function manhattanDistance(from: [number, number], to: [number, number]) {
    let yDiff = from[0] - to[0];
    let xDiff = from[1] - to[1];

    return Math.abs(yDiff) + Math.abs(xDiff);
}

export async function part2() {
    let grid: string[][] = [];

    let galaxies: [number, number][] = [];

    let rowExpansion: number[] = [];
    let columnExpansion: number[] = [];

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        grid.push(line.split(''));

        if(!line.includes('#'))
            rowExpansion.push(grid.length);
    });

    // Find column expansions
    for(let x = 0; x < grid[0].length; x++) {
        let hasGalaxy = false;
        for(let y = 0; y < grid.length; y++) {
            if(grid[y][x] == '#') {
                hasGalaxy = true;
            }
        }

        if(!hasGalaxy) {
            columnExpansion.push(x);
        }
    }

    columnExpansion.forEach((column, index) => {
        insertBlankColumn(grid, column + index, '*');
    });

    let blankRow = Array(grid[0].length);
    blankRow = blankRow.fill('*');
    rowExpansion.forEach((row, index) => {
        grid.splice(row + index, 0, blankRow);
    });

    for(let y = 0; y < grid.length; y++) {
        console.log(`${grid[y].join('')}`);
    }

    // Subtract 2 from the offset size because account for indexing at 0
    // and that on space is taken up with the '*' column or row
    let offsetSize = 1000000 - 2;

    let yOffset = 0;
    for(let y = 0; y < grid.length; y++) {
        if(grid[y][0] === '*') {
            yOffset += offsetSize;
            // console.log(`Row ${y} is an expansion`);
            continue; // no galaxies on this row
        }

        let xOffset = 0;
        for(let x = 0; x < grid[0].length; x++) {
            if(grid[y][x] === '*') {
                // console.log(`Column ${x} is an expansion`);
                xOffset += offsetSize;
            }

            if(grid[y][x] === '#') {
                galaxies.push([y + yOffset, x + xOffset]);
            }
        }
    }

    let sum = 0;
    for(let i = 0; i < galaxies.length; i++) {
        for(let j = i+1; j < galaxies.length; j++) {
            if(i == j) continue;

            // console.log(`Distance from ${i+1}:${galaxies[i]} to ${j+1}:${galaxies[j]} is ${manhattanDistance(galaxies[i], galaxies[j])}`);
            sum += manhattanDistance(galaxies[i], galaxies[j]);
        }
    }

    return sum;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 9978239 (too high)
 * 9974721 (correct)
 * 
 * Part 2:
 * 82000210 (too low)
 * 702770569197 (correct)
 */
