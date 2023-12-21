import { parseLinesFromInput } from '../util/parseInput';

const APPROVED = 'A';
const REJECTED = 'R';

type Range = [number, number];

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

type Input = {
    x: number; m:number; a: number; s: number;
}

type InputRange = Record<keyof Input, Range>;

export async function part1() {
    let parsingFunctions = true;
    let functions = new Map<string, Function>();
    let inputs: Input[] = [];
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(line === '') {
            parsingFunctions = false;
            return;
        }

        if(parsingFunctions) {
            let func = parseFunction(line);
            functions.set(func.name, func);
        } else {
            let input = parseInput(line);
            inputs.push(input);
        }
    });

    console.log('Functions: ');
    functions.forEach((value, key) => {
        console.log(key + ': ' + JSON.stringify(value));
    });

    let approved: number = 0;

    for(let input of inputs) {
        let result: string = evaluate(input, functions);
        if(result === APPROVED) {
            console.log('Approved: ' + JSON.stringify(input));
            approved += input.x;
            approved += input.a;
            approved += input.s;
            approved += input.m;
        }
    }

    return approved;
}

function parseFunction(line: string): Function {
    let parts = line.split('{');
    let out: Function = {name: parts[0].trim(), conditions: [], returns: [], default: ''};

    let conditions = parts[1].split(',');
    for(let i = 0; i < conditions.length - 1; i++) {
        let operation: Operator = conditions[i].charAt(1) === '>' ? Operator.GT : Operator.LT;
        let condition: Condition = {arg: conditions[i].charAt(0), op: operation, val: 0};
        let vals = conditions[i].substring(2).split(':');
        condition.val = parseInt(vals[0]);

        let result = vals[1].trim();

        out.conditions.push(condition);
        out.returns.push(result);
    }

    out.default = conditions[conditions.length - 1].replace('}', '').trim();

    return out;
}

function parseInput(line: string): Input {
    let out: Input = {x: 0, a: 0, s: 0, m: 0};
    line = line.replace('{', '').replace('}', '');

    let parts = line.split(',');
    for(let part of parts) {
        let vals = part.split('=');
        let val = parseInt(vals[1]);

        switch(vals[0].trim()) {
            case 'x': out.x = val; break;
            case 'a': out.a = val; break;
            case 's': out.s = val; break;
            case 'm': out.m = val; break;
        }
    }

    return out;
}

function evaluate(input: Input, functions: Map<string, Function>): string {
    let result = '';
    let funcName = 'in';
    while(result !== APPROVED && result !== REJECTED) {
        let fcn = functions.get(funcName);
        if(fcn === undefined) {
            console.log('Function ' + funcName + ' not found!');
            return REJECTED;
        }
        result = _evaluate(input, fcn);
        funcName = result;
    }

    return result;
}

function _evaluate(input: Input, fcn: Function): string {
    for(let i = 0; i < fcn.conditions.length; i++) {
        switch(fcn.conditions[i].arg) {
            case 'x': if(compare(input.x, fcn.conditions[i].op, fcn.conditions[i].val)) return fcn.returns[i]; break;
            case 'a': if(compare(input.a, fcn.conditions[i].op, fcn.conditions[i].val)) return fcn.returns[i]; break;
            case 's': if(compare(input.s, fcn.conditions[i].op, fcn.conditions[i].val)) return fcn.returns[i]; break;
            case 'm': if(compare(input.m, fcn.conditions[i].op, fcn.conditions[i].val)) return fcn.returns[i]; break;
        }
    }

    return fcn.default;
}

function compare(val: number, op: Operator, compare: number): boolean {
    switch(op) {
        case Operator.GT: return val > compare;
        case Operator.LT: return val < compare;
    }
}

export async function part2() {
    let parsingFunctions = true;
    let functions = new Map<string, Function>();
    await parseLinesFromInput(__dirname + '/example.txt', line => {
        if(line === '') {
            parsingFunctions = false;
            return;
        }

        if(parsingFunctions) {
            let func = parseFunction(line);
            functions.set(func.name, func);
        }
    });

    console.log('Functions: ');
    functions.forEach((value, key) => {
        console.log(key + ': ' + JSON.stringify(value));
    });

    let input: InputRange = {x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000]}

    return 0;
}

function findAcceptedRanges(fcn: string, input: InputRange, functions: Map<string, Function>) {
    let acceptedRanges: InputRange[] = [];
    let part: InputRange = { ...input };

    let myFunction = functions.get(fcn) ?? {name: '', conditions: [], returns: [], default: ''};
    for(let i = 0; i < myFunction.conditions.length; i++) {

    }

    return acceptedRanges;
}

function evaluateRange(range: Range, op: Operator, compare: number): {accepted: Range | null; rejected: Range | null} {
    switch(op) {
        case Operator.GT: return {accepted: [compare + 1, range[1]], rejected: [range[0], compare]};
        case Operator.LT: return {accepted: [range[0], compare - 1], rejected: [compare, range[1]]};
    }

    return {accepted: null, rejected: null};
}

/**
 * Attempted Answers:
 * 
 */
