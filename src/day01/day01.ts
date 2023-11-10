import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    // console.log("Starting part 1");
    let sum = 0;

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let start: string = '0';
        let end: string = '0';

        for (let f = 0; f < line.length; f++) {
            // console.log("Trying to parse: " + line[f] + " result: " + Number.parseInt(line[f]));
            if (!isNaN(Number(line[f]))) {
                start = line[f];
                break;
            }
        }

        for (let e = line.length - 1; e >= 0; e--) {
            if (!isNaN(Number(line[e]))) {
                end = line[e];
                break;
            }
        }

        let number = Number.parseInt(start + end);
        // console.log("Found number: " + number);
        sum += number;
    });

    // console.log("The sum is: " + sum);
    return sum;
}

export async function part2() {
    // console.log("Starting part 2");

    interface DigitMap {
        [key: string]: string;
    }

    let digitMap: DigitMap = {
        'one': '1',
        'two': '2',
        'three': '3',
        'four': '4',
        'five': '5',
        'six': '6',
        'seven': '7',
        'eight': '8',
        'nine': '9'
    }

    let sum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let start = '';
        let end = '';

        let matchMap = {
            'one': 0,
            'two': 0,
            'three': 0,
            'four': 0,
            'five': 0,
            'six': 0,
            'seven': 0,
            'eight': 0,
            'nine': 0
        }

        let matchMapReverse = {
            'eno': 0,
            'owt': 0,
            'eerht': 0,
            'ruof': 0,
            'evif': 0,
            'xis': 0,
            'neves': 0,
            'thgie': 0,
            'enin': 0
        }

        // Loop 1: Find starting digit
        let stopIndex = 0;
        for (let f = 0; f < line.length; f++) {
            // Rule 1: If we see a number first, we're done
            if (!isNaN(Number(line[f]))) {
                start = line[f];
                stopIndex = f;
                break;
            }

            // Rule 2: See if we can spell out a digit
            let wordIndex = checkPartOfWord(line[f], matchMap);
            if(wordIndex != -1) {
                start = digitMap[Object.keys(digitMap)[wordIndex]];
                stopIndex = f;
                break;
            }
        }

        // Loop 2: Find ending digit
        for (let e = line.length - 1; e >= 0; e--) {
            if (!isNaN(Number(line[e]))) {
                end = line[e];
                // console.log("Found a digit not a word " + line + " " + end + " " + JSON.stringify(matchMapReverse));
                break;
            }

            // Rule 2: See if we can spell out a digit
            let wordIndex = checkPartOfWord(line[e], matchMapReverse);
            if(wordIndex != -1) {
                end = digitMap[Object.keys(digitMap)[wordIndex]];
                break;
            }
        }

        let number = Number.parseInt(start + end);
        sum += number;
        // console.log(line + "," + start + "," + end + "," + (start+end) + "," + sum);
    });

    // console.log("The sum is: " + sum);
    return sum;
}

function checkPartOfWord(letter: string, matchMap: any) {
    for(let d = 0; d < Object.keys(matchMap).length; d++) {
        let index = matchMap[Object.keys(matchMap)[d]];
        if(letter == Object.keys(matchMap)[d][index]) { // we have a start to our word
            matchMap[Object.keys(matchMap)[d]] += 1;
        } else { // must be consecutive
            if(letter == Object.keys(matchMap)[d][0]) {
                matchMap[Object.keys(matchMap)[d]] = 1;
            } else {
                matchMap[Object.keys(matchMap)[d]] = 0;
            }
        }

        if(matchMap[Object.keys(matchMap)[d]] == Object.keys(matchMap)[d].length) { // the word is complete
            return d;
        }
    }
    return -1; // word is not found
}

// Part 1 Answers:
// 54388: correct

// Part 2 Answers:
// 53370: too low
// 53526: too high
// 53515: correct
