import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let sum = 0;

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let parts = line.split(' ');
        let groups: number[] = parts[1].split(',').map((number) => parseInt(number.trim()));
        
        let allLines = generateLines(parts[0], parts[0].length);

        let numArrangements = 0;
        allLines.forEach((newLine) => {
            let numGroups = getGroupsFromGears(newLine);
            if(areNumbersEqual(groups, numGroups)) { // this is a possible combination
                // console.log(`${newLine} has ${numGroups}`);
                numArrangements += 1;
            }
        });
        // console.log(`Line ${parts[0]} has ${numArrangements} arrangements`);
        sum += numArrangements;
    });

    return sum;
}

function generateLines(line: string, lineLength: number): string[] {
    // Base Case
    if(line === '?') {
        let lines = [];
        lines.push('.');
        lines.push('#');
        return lines;
    } else if(line.length === 1) {
        let lines = [];
        lines.push(line);
        return lines;
    }

    // Recursive case
    let lines = generateLines(line.slice(1), lineLength);
    if(line[0] === '.' || line[0] === '#') { // simple add character to line
        lines = lines.map((myLine) => line[0] + myLine);
    } else if(line[0] === '?') { // double the lines list to add a '.' and '#'
        let operational = lines.map((myLine) => '.' + myLine);
        let damaged = lines.map((myLine) => '#' + myLine);
        lines = operational.concat(damaged);
    }

    return lines;
}

function getGroupsFromGears(gears: string): number[] {
    let output: number[] = [];
    let groupSize = 0;
    for(let i = 0; i < gears.length; i++) {
        if(gears[i] === '#') {
            groupSize += 1;
        } else if(groupSize > 0) {
            output.push(groupSize);
            groupSize = 0;
        }
    }

    if(groupSize > 0) {
        output.push(groupSize);
        groupSize = 0;
    }

    return output;
}

function areNumbersEqual(a: number[], b: number[]) {
    if(a.length !== b.length) {
        return false;
    }

    return a.every((val, idx) => val === b[idx]);
}

export async function part2() {
    let sum = 0;

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let parts = line.split(' ');
        
        let groups: number[] = parts[1].split(',').map((number) => parseInt(number.trim()));
        groups = Array(5).fill(groups).flat();

        let allLines = generateLines(parts[0], parts[0].length);

        let numArrangements = 0;
        allLines.forEach((newLine) => {
            let numGroups = getGroupsFromGears(newLine);
            if(areNumbersEqual(groups, numGroups)) { // this is a possible combination
                // console.log(`${newLine} has ${numGroups}`);
                numArrangements += 1;
            }
        });
        // console.log(`Line ${parts[0]} has ${numArrangements} arrangements`);
        sum += numArrangements;
    });

    return sum;
}

function unfoldLine(line: string) {

    return line;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 7260 (correct)
 * 
 */
