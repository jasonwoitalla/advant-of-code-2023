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
        [key: string]: [number, boolean];
    }
    let seedPositions: SeedPositions = {}

    let lineNum = 0;
    let lastLine = '';
    await parseLinesFromInput(__dirname + '/example.txt', line => {
        if(lineNum == 0) {
            let matches = line.match(/\d+/g);
            if(matches) {
                initialSeeds = matches.map((e) => parseInt(e));
                // initialSeeds.map((n) => seedPositions[n] = [n, false]);
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
