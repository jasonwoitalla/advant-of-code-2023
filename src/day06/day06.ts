import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let times: number[] = [];
    let distances: number[] = [];

    await parseLinesFromInput(__dirname + '/example.txt', line => {
        let matches = line.match(/\d+/g);
        if(matches && times.length == 0) {
            times = matches.map((e) => parseInt(e));
        } else if(matches) {
            distances = matches.map((e) => parseInt(e));
        }
    });

    // Go through the races
    let product = 1;
    for(let i = 0; i < times.length; i++) {
        let numWays = 0;
        for(let b = 0; b < times[i]; b++) {
            let distance = getDistance(b, times[i] - b);
            if(distance > distances[i]) {
                numWays += 1;
            }
        }
        product *= numWays;
    }

    return product;
}

export async function part2() {
    let times: number[] = [];
    let distances: number[] = [];

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let matches = line.replace(/\s*/g, "").match(/\d+/g);
        if(matches && times.length == 0) {
            times = matches.map((e) => parseInt(e));
        } else if(matches) {
            distances = matches.map((e) => parseInt(e));
        }
    });

    // Go through the races
    let product = 1;
    for(let i = 0; i < times.length; i++) {
        let numWays = 0;
        for(let b = 0; b < times[i]; b++) {
            let distance = getDistance(b, times[i] - b);
            if(distance > distances[i]) {
                numWays += 1;
            }
        }
        product *= numWays;
    }

    return product;
}

function getDistance(buttonTime: number, timeLeft: number) {
    return buttonTime * timeLeft;
}
