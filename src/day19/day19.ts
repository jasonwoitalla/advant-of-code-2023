import { parseLinesFromInput } from '../util/parseInput';

const APPROVED = 'A';
const REJECTED = 'R';

enum Operator {
    GT = '>',
    LT = '<'
}

type Function = {
    name: string;
    conditions: Condition[];
    returns: string[];
    default: string;
}

type Condition = {
    arg: string;
    op: Operator;
    val: number;
}

export async function part1() {
    await parseLinesFromInput(__dirname + '/example.txt', line => {

    });

    let functions = new Map<string, Function>();

    return 0;
}

function parseFunction(line: string): Function {
    let parts = line.split('{');
    let out: Function = {name: parts[0].trim(), conditions: [], returns: [], default: ''};

    let conditions = parts[1].split(',');
    for(let i = 0; i < conditions.length - 1; i++) {
        let condition: Condition = {arg: conditions[i].charAt(0), op: conditions[i].charAt(1) as Operator, val: 0};
        let vals = conditions[i].substring(2).split(':');
        condition.val = parseInt(vals[0]);

        let result = vals[1].trim();

        out.conditions.push(condition);
        out.returns.push(result);
    }

    return out;
}

export async function part2() {
    await parseLinesFromInput(__dirname + '/example.txt', line => {
    });

    return 0;
}

/**
 * Attempted Answers:
 * 
 */
