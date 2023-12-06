import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let initialSeeds: number[] = [];

    interface SeedPositions {
        [key: string]: [number, boolean];
    }
    let seedPositions: SeedPositions = {}

    let lineNum = 0;
    let lastLine = '';
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(lineNum == 0) {
            let matches = line.match(/\d+/g);
            if(matches) {
                initialSeeds = matches.map((e) => parseInt(e));
                initialSeeds.map((n) => seedPositions[n] = [n, false]);
                // console.log(initialSeeds);
                // console.log(seedPositions);
            }
            lineNum = 1;
            return;
        }

        if(lastLine == "") {
            // console.log(`Pre ${line}: ${JSON.stringify(seedPositions)}`);
            Object.keys(seedPositions).forEach((seed) => {
                seedPositions[seed] = [seedPositions[seed][0], false];
            });
        }

        let numberMatches = line.match(/\d+/g);
        if(numberMatches) {
            let currentMap = numberMatches.map((e) => parseInt(e));

            let destStart = currentMap[0];
            let sourceStart = currentMap[1];
            let length = currentMap[2];
            // console.log(`Line ${lineNum}: destStart=${destStart} sourceStart=${sourceStart} length=${length}`);

            Object.keys(seedPositions).forEach((seed) => {
                let diff = seedPositions[seed][0] - sourceStart;
                // console.log(`Seed ${seedPositions[seed]} has diff=${diff}`)
                if(diff < 0 || diff >= length || seedPositions[seed][1]) {
                    return;
                }

                // console.log(`Diff=${diff} we are going to set ${seedPositions[seed]} => ${destStart + diff}`)
                seedPositions[seed] = [destStart + diff, true];
            });
            // console.log(`Line ${lineNum} got positions: ${JSON.stringify(seedPositions)}`);
        }

        lineNum += 1;
        lastLine = line;
    });

    // console.log(`Final Positions: ${JSON.stringify(seedPositions)}`);
    let min = 999999999999;
    Object.keys(seedPositions).forEach((seed) => {
        min = Math.min(seedPositions[seed][0], min);
    });
    return min;
}

export async function part2() {
    let initialSeeds: number[] = [];

    interface SeedPositions {
        [key: string]: [number, number][];
    }
    let seedPositions: SeedPositions = {}
    let ranges: Map<[number, number], [number, number]> = new Map();

    let lineNum = 0;
    let lastLine = '';
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(lineNum == 0) {
            let matches = line.match(/\d+/g);
            if(matches) {
                initialSeeds = matches.map((e) => parseInt(e));
                for(let i = 0; i < initialSeeds.length; i += 2) {
                    let startPos = initialSeeds[i];
                    let endPos = initialSeeds[i] + initialSeeds[i+1] - 1;
                    seedPositions[`${startPos},${endPos}`] = [[startPos, endPos]];
                }
            }
            lineNum = 1;
            return;
        }

        if(line == "") { // process range maps
            // console.log(`Old Mappings: ${JSON.stringify(seedPositions)}`);
            Object.keys(seedPositions).forEach((seed) => {
                let currentRanges = seedPositions[seed];
                currentRanges = splitRanges(currentRanges, ranges);
                // console.log(`We have split our ranges up here: ${currentRanges}`);

                // Map ranges
                let newPositions: [number, number][] = [];
                currentRanges.forEach((range) => {
                    newPositions.push(mapRange(range, ranges));
                });
                // console.log(`New seed positions: ${seed} => [${newPositions}]`);
                seedPositions[seed] = newPositions;
            });

            // console.log(`Loaded ranges: ${[...ranges.entries()]}`);
            // console.log(`New Mappings: ${JSON.stringify(seedPositions)}`);
            // console.log("");

            ranges = new Map();
            lineNum += 1;
            return;
        }

        // Attempt to read in ranges
        let numberMatches = line.match(/\d+/g);
        if(numberMatches) {
            let currentMap = numberMatches.map((e) => parseInt(e));

            let length = currentMap[2] - 1;
            let destRange: [number, number] = [currentMap[0], currentMap[0] + length];
            let sourceRange: [number, number] = [currentMap[1], currentMap[1] + length];

            ranges.set(sourceRange, destRange);
        }

        lineNum += 1;
        lastLine = line;
    });

    let min = 999999999999;
    // Loop through each initial seed range, and find the smallest starting range
    Object.keys(seedPositions).forEach((seed) => {
        for(let i = 0; i < seedPositions[seed].length; i++) {
            if(seedPositions[seed][i][0] < min) {
                min = seedPositions[seed][i][0];
            }
        }
    });
    return min;
}

function isRangeInside(source: [number, number], dest: Map<[number, number], [number, number]>): [boolean, [number, number]] {
    let output: [boolean, [number, number]] = [false, [-1, -1]];
    
    Array.from(dest.keys()).forEach((key) => {
        if(source[0] >= key[0] && source[0] <= key[1]) {
            output = [true, key];
            return;
        }
    });

    return output;
}

// Loops through the source ranges and returns a list of ranges fit within the destination ranges
function splitRanges(sourceRanges: [number, number][], destRanges: Map<[number, number], [number, number]>) {
    let output: [number, number][] = [];

    sourceRanges.forEach((range) => {
        let currentRange = range;
        let [isInside, foundRange] = isRangeInside(currentRange, destRanges);
        // check for splits
        while(isInside) {
            if(currentRange[1] > foundRange[1]) { // we need to split
                output.push([currentRange[0], foundRange[1]]);
                currentRange = [foundRange[1] + 1, currentRange[1]];
                [isInside, foundRange] = isRangeInside(currentRange, destRanges);
            } else {
                isInside = false;
            }
        }

        output.push(currentRange);
    });

    return output;
}

function mapRange(myRange: [number, number], ranges: Map<[number, number], [number, number]>): [number, number] {
    let mappingRange: [number, number] = [0,0];
    for(mappingRange of Array.from(ranges.keys())) {
        if(myRange[0] >= mappingRange[0] && myRange[1] <= mappingRange[1]) {
            // console.log(`Attempting to map [${myRange}] on [${mappingRange}]`);
            let destRange = ranges.get(mappingRange);
            if(destRange) {
                let diff = destRange[0] - mappingRange[0];
                // console.log(`We got an output range of [${[myRange[0] + diff, myRange[1] + diff]}]`);
                return [myRange[0] + diff, myRange[1] + diff];
            }
        }
    }
    return myRange;
}

/**
 * Attempted Answers:
 * 
 * Pat 2:
 * 13606986 (too high)
 * 1240035 (correct)
 */
