const fs = require("fs");
const readLine = require("readline");

/**
 * 
Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.

You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.

For example:

1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
In this example, the calibration values of these four lines are 12, 38, 15, and 77. Adding these together produces 142.

Consider your entire calibration document. What is the sum of all of the calibration values?

Your puzzle answer was 54388.

--- Part Two ---
Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

What is the sum of all of the calibration values?

Your puzzle answer was 53515.

Both parts of this puzzle are complete! They provide two gold stars: **
 */

async function part1() {
    const fileStream = fs.createReadStream("inputs/day1.txt");
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    console.log("Starting part 1");
    let sum = 0;
    for await(const line of rl) {
        let start = '0';
        let end = '0';

        for (let f = 0; f < line.length; f++) {
            // console.log("Trying to parse: " + line[f] + " result: " + Number.parseInt(line[f]));
            if (!isNaN(line[f])) {
                start = line[f];
                break;
            }
        }

        for (let e = line.length - 1; e >= 0; e--) {
            if (!isNaN(line[e])) {
                end = line[e];
                break;
            }
        }

        let number = Number.parseInt(start + end);
        // console.log("Found number: " + number);
        sum += number;
    }

    console.log("The sum is: " + sum);
}

async function part2() {
    const fileStream = fs.createReadStream("inputs/day1.txt");
    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    console.log("Starting part 2");

    let digitMap = {
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
    let bugTracker = {};
    for await(const line of rl) {
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
            if (!isNaN(line[f])) {
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
            if (!isNaN(line[e])) {
                end = line[e];
                // console.log("Found a digit not a word " + line + " " + end + " " + JSON.stringify(matchMapReverse));
                break;
            }

            // Rule 2: See if we can spell out a digit
            let wordIndex = checkPartOfWord(line[e], matchMapReverse);
            if(wordIndex != -1) {
                end = digitMap[Object.keys(digitMap)[wordIndex]];
                if(!(end in bugTracker))
                    bugTracker[end] = line;
                break;
            }
        }

        if(isNaN(start) || isNaN(end)) {
            console.error("ERROR: our numbers didn't go through: " + start + " " + end);
        }

        let number = Number.parseInt(start + end);
        sum += number;
        console.log(line + "," + start + "," + end + "," + (start+end) + "," + sum);
    }

    console.log("The sum is: " + sum);
}

function checkPartOfWord(letter, matchMap) {
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

// part1();
part2();

// Part 1 Answers:
// 54388: correct

// Part 2 Answers:
// 53370: too low
// 53526: too high
// 53515: correct
