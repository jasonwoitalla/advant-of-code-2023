import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let sum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let matches = line.split(' ');
        let numbers = matches.map(match => parseInt(match));

        let nextValue = nextValueOfList(numbers);
        if(nextValue) {
            sum += nextValue;
        }
    });

    return sum;
}

export async function part2() {
    let sum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let matches = line.split(' ');
        let numbers = matches.map(match => parseInt(match));

        let nextValue = nextValueOfList(numbers.reverse());
        if(nextValue) {
            sum += nextValue;
        }
    });

    return sum;
}

function nextValueOfList(list: number[]) : number {
    let isZero = list.every(value => value === 0);
    if(isZero) {
        return 0;
    }

    let newList = [];
    for(let i = 0; i < list.length - 1; i++) {
        newList.push(list[i + 1] - list[i]);
    }
    
    let nextListResult: number = nextValueOfList(newList);
    let newResult = list[list.length - 1] + nextListResult;

    return newResult;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 2037738726 (too high)
 * 1535029075 (too low)
 * 1991417710 (too high)
 * 
 * my parser was incorrect, my first function was correct
 * 1877825184 (correct)
 */
