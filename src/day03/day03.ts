import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let schematicMatrix: string[][] = [];

    // Phase 1: Build the schematic matrix
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        schematicMatrix.push(line.split(''));
    });

    // Phase 2: Traverse the matrix

    // notes: loop through the matrix and if we find a number we will enter a for loop that will stop when there is no longer a number
    //        at each point we will also check if it's touching a symbol. After the loop if it is touching a symbol, we will add the calculated number to the sum.

    let sum = 0;
    for(let i = 0; i < schematicMatrix.length; i++) {
        for(let j = 0; j < schematicMatrix[i].length; j++) {
            if(isNaN(parseInt(schematicMatrix[i][j]))) { // no number, not interested.
                continue;
            }

            let number = parseInt(schematicMatrix[i][j]);
            let [touchingSymbol, x, y] = isTouchingSymbol(schematicMatrix, i, j, isSymbol);
            schematicMatrix[i][j] = '.'; // mark this spot as visited

            for(let n = 1; n < 3; n++) {
                if(j + n >= schematicMatrix[i].length) { // out of bounds
                    break;
                }

                let nextCharacter = schematicMatrix[i][j + n];
                if(!isNaN(parseInt(nextCharacter))) { // keep building the number
                    number = number * 10 + parseInt(nextCharacter);
                    if(!touchingSymbol) { // check if this spot is touching a symbol
                        [touchingSymbol, x, y] = isTouchingSymbol(schematicMatrix, i, j + n, isSymbol);
                    }

                    schematicMatrix[i][j + n] = '.'; // mark this spot as visited
                } else {
                    break;
                }
            }

            if(touchingSymbol) {
                sum += number;
            }
        }
    }

    return sum;
}

export async function part2() {
    let schematicMatrix: string[][] = [];

    // Phase 1: Build the schematic matrix
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        schematicMatrix.push(line.split(''));
    });

    // Phase 2: Traverse the matrix

    // gear ratio is a map of [x, y] positions of a gear and the product of numbers touching that gear and how many numbers are touching that gear
    let gearRatio = new Map<string, [number, number]>();

    for(let i = 0; i < schematicMatrix.length; i++) {
        for(let j = 0; j < schematicMatrix[i].length; j++) {
            if(isNaN(parseInt(schematicMatrix[i][j]))) { // no number, not interested.
                continue;
            }

            let number = parseInt(schematicMatrix[i][j]);
            let [touchingSymbol, symbolX, symbolY] = isTouchingSymbol(schematicMatrix, i, j, isSymbolPart2);
            schematicMatrix[i][j] = '.'; // mark this spot as visited

            for(let n = 1; n < 3; n++) {
                if(j + n >= schematicMatrix[i].length) { // out of bounds
                    break;
                }

                let nextCharacter = schematicMatrix[i][j + n];
                if(!isNaN(parseInt(nextCharacter))) { // keep building the number
                    number = number * 10 + parseInt(nextCharacter);
                    if(!touchingSymbol) { // check if this spot is touching a symbol
                        [touchingSymbol, symbolX, symbolY] = isTouchingSymbol(schematicMatrix, i, j + n, isSymbolPart2);
                    }

                    schematicMatrix[i][j + n] = '.'; // mark this spot as visited
                } else {
                    break;
                }
            }

            if(touchingSymbol) {
                let key = `${symbolX},${symbolY}`;
                // console.log(`Number ${number} is touching a gear at [${symbolX}, ${symbolY}] does it exist? ${gearRatio.has(key)}`);
                if(!gearRatio.has(key)) {
                    gearRatio.set(key, [number, 1]);
                } else {
                    let [product, count] = gearRatio.get(key)!;
                    product *= number;
                    count += 1;

                    gearRatio.set(key, [product, count]);
                }
            }
        }
    }

    // Phase 3: Multiply gear ratios
    let sum = 0;
    for(let [key, value] of gearRatio) {
        let [product, count] = value;
        if(count == 2) {
            sum += product;
        }
    }

    return sum;
}

function isTouchingSymbol(schematicMatrix: string[][], i: number, j: number, symbolCheck: (character: string) => boolean): [boolean, number, number] {
    for(let x = -1; x <= 1; x++) {
        for(let y = -1; y <= 1; y++) {
            if(x === 0 && y === 0) {
                continue;
            }

            if (i + x < 0 || i + x >= schematicMatrix.length || j + y < 0 || j + y >= schematicMatrix[i].length) {
                continue;
            }

            if(symbolCheck(schematicMatrix[i + x][j + y])) {
                return [true, i + x, j + y];
            }
        }
    }

    return [false, -1, -1];
}

function isSymbol(character: string) {
    return isNaN(parseInt(character)) && character !== '.';
}

function isSymbolPart2(character: string) {
    return character === '*';
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 556091 (too high)
 * 
 */
