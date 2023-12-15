import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let sum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let steps = line.split(',');
        for(let step of steps) {
            sum += hash(step);
            // console.log(`Step ${step} has hash value ${runningHash}`);
        }
    });

    return sum;
}

function hash(msg: string) {
    let hash = 0;

    for(let i = 0; i < msg.length; i++) {
        let ascii = msg.charCodeAt(i);

        hash += ascii;
        hash *= 17;
        hash %= 256;
    }

    return hash;
}

export async function part2() {
    let hashmap: Map<number, Map<string, number>> = new Map();
    let numBoxes = 256;
    for(let i = 0; i < numBoxes; i++) {
        hashmap.set(i, new Map());
    }

    let sum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let steps = line.split(',');
        for(let step of steps) {
            let label = '';
            let focalLength = '';
            let remove = false;
            if(step.includes('=')) { // add / replace operation
                [label, focalLength] = step.split('=');
            } else { // remove operation
                label = step.substring(0, step.length - 1);
                remove = true;
            }

            let boxNum = hash(label);
            if(remove && hashmap.get(boxNum)?.has(label)) { // we have this label
                hashmap.get(boxNum)?.delete(label);
            } else if(!remove) {
                hashmap.get(boxNum)?.set(label, parseInt(focalLength));
            }
            // console.log(`The box number for label: ${label} is ${boxNum}`);
            // hashmap.forEach((val, key) => {
            //     console.log(`Box ${key} is ${JSON.stringify([...val])}`);
            // });
        }
    });

    hashmap.forEach((val, key) => {
        console.log(`Box ${key} is ${JSON.stringify([...val])}`);
    });

    hashmap.forEach((val, key) => {
        let position = 1;
        val.forEach((focalLength, label) => {
            sum += (key + 1) * position * focalLength;
            position += 1;
        });
    });

    return sum;
}

/**
 * Attempted Answers:
 * 
 */
