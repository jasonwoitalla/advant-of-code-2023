import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let sum = 0;

    await parseLinesFromInput(__dirname + '/example.txt', line => {
        let parts = line.split(' ');
        let groups: number[] = parts[1].split(',').map((number) => parseInt(number.trim()));
        
        let allLines = generateLines(parts[0]);
        let numQuestionMarks = parts[0].split('').filter((char) => char === '?').length;

        console.log(`Line ${parts[0]} has ${numQuestionMarks} question marks, which generated ${allLines.length} lines`);

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

function generateLines(line: string): string[] {
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
    let lines = generateLines(line.slice(1));
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

        parts[0] = unfoldLine(parts[0]);

        // console.log(`Expanded line: ${parts[0]} ${groups}`);

        let table = new Map<string, number>();
        let numArrangements = findNumArrangements(parts[0], groups, table);

        // console.log(`Line ${parts[0]} has ${numArrangements} arrangements`);

        sum += numArrangements;
    });

    return sum;
}

function unfoldLine(line: string) {
    let newLine = '';
    for(let i = 0; i < 5; i++) {
        newLine += line;
        if (i < 4)
            newLine += '?';
    }

    return newLine;
}

function findNumArrangements(line: string, groups: number[], table: Map<string, number>): number {
    // Base Case
    line = trimLine(line);
    if(line === '') { // no more characters, check if groups is empty
        return groups.length === 0 ? 1 : 0;
    } else if(groups.length === 0) { // no more groups, check if there is any blocked springs
        return line.includes('#') ? 0 : 1;
    }

    // Memoization
    let key = line + groups.toString();
    if(table.has(key)) {
        return table.get(key)!;
    }

    // Recursive case
    // try and match the damaged springs with the current group number
    // if we see a ? we can either add it to the current group or start a new group
    let numArrangements = 0;
    let damaged = countDamaged(line);
    if(damaged === groups[0]) { // we have a possible arrangement
        // console.log(`Found a possible arrangement: ${line} ${groups}`);
        numArrangements += findNumArrangements(line.slice(damaged), groups.slice(1), table);
    }

    if(damaged === 0 && line.includes('?')) {
        numArrangements += findNumArrangements(line.replace('?', '#'), groups, table);
        numArrangements += findNumArrangements(line.replace('?', '.'), groups, table);
    }

    table.set(key, numArrangements);
    return numArrangements;
}

function trimLine(line: string): string {
    let start = 0;
    let end = line.length - 1;

    while(line[start] === '.') {
        start += 1;
    }

    while(line[end] === '.') {
        end -= 1;
    }

    return line.slice(start, end + 1);
}

function countDamaged(line: string): number {
    let count = 0;
    for(let i = 0; i < line.length; i++) {
        if(line[i] === '#') {
            count += 1;
        } else if(line[i] === '.') {
            return count; // valid damaged block
        } else if(line[i] === '?') {
            return 0; // can be either damaged or operational
        }
    }

    return count;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 7260 (correct)
 * 
 */
