import { parseLinesFromInput } from '../util/parseInput';

type Reflection = Record<number, number>;

export async function part1() {
    let grids: Map<number, string[][]> = new Map();

    let gridNum = 0;
    let grid: string[][] = [];
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(line === '') {
            grids.set(gridNum, grid);
            grid = [];
            gridNum += 1;
            return;
        }

        grid.push(line.split(''));
    });

    let sum = 0;
    for(let key of grids.keys()) {
        // console.log(`Grid ${key}: checking rows`);
        let perfectRows = iterativeFindReflecting(grids.get(key)!, grids.get(key)!.length - 1, true);
        if(perfectRows.length > 0) {
            // console.log(`Grid ${key} has a reflecting rows ${perfectRows}`);
            sum += parseInt(perfectRows.split(',')[0]) * 100;
        }

        // console.log(`Grid ${key}: checking cols`);
        let perfectCols = iterativeFindReflecting(grids.get(key)!, grids.get(key)![0].length - 1, false);
        if(perfectCols.length > 0) {
            // console.log(`Grid ${key} has a reflecting cols ${perfectCols}`);
            sum += parseInt(perfectCols.split(',')[0]);
        }
    }

    return sum;
}

function iterativeFindReflecting(grid: string[][], size: number, isRow: boolean) {
    let start = 0;
    let end = size;
    let lastMatch = -1;
    let match = false;

    // Move the end to meet the start
    while(start < end) {
        if(isRow) {
            match = grid[start].every((val, index) => val === grid[end][index]);
        } else {
            let col = grid.map((row) => row[start]);
            match = col.every((val, index) => val === grid[index][end]);
        }

        if(match) {
            lastMatch = end;
            start += 1;
            end -= 1;

            if(start === end) { // edge case check
                if(lastMatch === -1) {
                    end -= 1;
                } else {
                    start = 0;
                    end = lastMatch - 1;
                    lastMatch = -1;
                }
            }

        } else {
            if(lastMatch === -1) {
                end -= 1;
            } else {
                start = 0;
                end = lastMatch - 1;
                lastMatch = -1;
            }
        }
    }
    // console.log(`    Moving the end results`);
    // console.log(`    match=${match} [${end + 1},${start + 1}]`);
    if(match) {
        return `${end+1},${start+1}`;
    }

    start = 0;
    end = size;

    // Move the start to meet the end
    while(start < end) {
        if(isRow) {
            match = grid[start].every((val, index) => val === grid[end][index]);
        } else {
            let col = grid.map((row) => row[start]);
            match = col.every((val, index) => val === grid[index][end]);
        }

        if(match) {
            lastMatch = start;
            start += 1;
            end -= 1;

            if(start === end) { // edge case check
                if(lastMatch === -1) {
                    start += 1;
                } else {
                    start = lastMatch + 1;
                    end = size;
                    lastMatch = -1;
                }
            }

        } else {
            if(lastMatch === -1) {
                start += 1;
            } else {
                start = lastMatch + 1;
                end = size;
                lastMatch = -1;
            }
        }
    }

    // console.log(`    Moving the start results`);
    // console.log(`    match=${match} [${end + 1},${start + 1}]`);
    // console.log(`    match=${match} end=${end} start=${start}`);
    if(match) {
        return `${end+1},${start+1}`;
    }

    return '';
}

export async function part2() {
    let grids: Map<number, string[][]> = new Map();

    let gridNum = 0;
    let grid: string[][] = [];
    await parseLinesFromInput(__dirname + '/example.txt', line => {
        if(line === '') {
            grids.set(gridNum, grid);
            grid = [];
            gridNum += 1;
            return;
        }

        grid.push(line.split(''));
    });

    let sum = 0;
    for(let key of grids.keys()) {
        // console.log(`Grid ${key}`);
        let myGrid = grids.get(key)!;
        // for(let row = 0; row < myGrid.length; row++) {
        //     console.log(JSON.stringify(myGrid[row]));
        // }
        let ogAnswer = getAnswer(myGrid)[0];

        // Brute-force flip every character one character at a time and check if we have a new answer
        let gotNewAnswer = false;
        console.log(`Grid ${key} should have ${myGrid.length*myGrid[0].length} iterations`);
        let count = 1;
        for(let i = 0; i < myGrid.length; i++) {
            if(gotNewAnswer)
                break;
            for(let j = 0; j < myGrid[0].length; j++) {
                if(gotNewAnswer) {
                    break;
                }
                let copy = myGrid.map((val) => val.slice());
                copy[i][j] = copy[i][j] === '.' ? '#' : '.';
                let newAnswers = getAnswer(copy);
                // console.log(`Grid ${key} itr=${count} Old answer=${ogAnswer} newAnswers=${newAnswers.join(' ')}`);
                
                for(let newAnswer of newAnswers) {
                    if(i === 15 && j === 3) {
                        console.log(`Grid ${key} itr=${count} Old answer=${ogAnswer} newAnswers=${newAnswers.join(' ')}`);
                        // console.log(`At 0,0 new answer=${newAnswer}`);
                        for(let row = 0; row < copy.length; row++) {
                            console.log(JSON.stringify(copy[row]));
                        }
                    }

                    if(newAnswer.length > 0 && ogAnswer !== newAnswer) {
                        console.log(`Grid ${key} had an answer of ${ogAnswer} and found a new one of ${newAnswer} at ${i},${j}`);
                        // console.log(`Changed character at ${i},${j} so grid looks like this: `);
                        // for(let row = 0; row < copy.length; row++) {
                        //     console.log(JSON.stringify(copy[row]));
                        // }
                        let parts = newAnswer.split(':');
                        let mult = parts[0] === 'Row' ? 100 : 1;
                        sum += parseInt(parts[1].split(',')[0]) * mult;
                        gotNewAnswer = true;
                        break;
                    }
                }

                count += 1;
            }
        }
    }

    return sum;
}

function getAnswer(grid: string[][]) {
    let answer = [];
    // console.log(`Grid ${key}: checking rows`);
    let perfectRows = iterativeFindReflecting(grid, grid.length - 1, true);
    if(perfectRows.length > 0) {
        // console.log(`Grid ${key} has a reflecting rows ${perfectRows}`);
        answer.push('Row:' + perfectRows);
    }

    // console.log(`Grid ${key}: checking cols`);
    let perfectCols = iterativeFindReflecting(grid, grid[0].length - 1, false);
    if(perfectCols.length > 0) {
        // console.log(`Grid ${key} has a reflecting cols ${perfectCols}`);
        answer.push('Col:' + perfectCols);
    }

    return answer;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 30354 (too low)
 * 45670 (too high)
 * 32005 (too low)
 * 40006 (correct)
 */
