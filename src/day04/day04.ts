import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let sum = 0;
    let card = 1;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let scratchOff = line.split(":")[1].trim().split("|");

        let winningNumbers = scratchOff[0].trim().split(" ").filter((number) => !isNaN(parseInt(number))).map((number) => parseInt(number.trim()));
        let myNumbers = scratchOff[1].trim().split(" ").filter((number) => !isNaN(parseInt(number))).map((number) => parseInt(number.trim()));

        let matches = myNumbers.reduce(((acc, val) => winningNumbers.includes(val) ? acc + 1 : acc), -1);
        // console.log(`Card ${card} has ${matches} matches`);

        if(matches >= 0) {
            sum += Math.pow(2, matches);
        }

        card += 1;
    });

    return sum;
}

export async function part2() {
    let cardWinningNumbers: number[][] = [];
    let cardNumbers: number[][] = [];

    let card = 1;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let scratchOff = line.split(":")[1].trim().split("|");

        let winningNumbers: number[] = scratchOff[0].trim().split(" ").filter((number) => !isNaN(parseInt(number))).map((number) => parseInt(number.trim()));
        let myNumbers: number[] = scratchOff[1].trim().split(" ").filter((number) => !isNaN(parseInt(number))).map((number) => parseInt(number.trim()));

        cardWinningNumbers.push(winningNumbers);
        cardNumbers.push(myNumbers);

        card += 1;
    });

    let sum = 0;
    for(let i = 0; i < cardNumbers.length; i++) {
        sum += countMatches(cardWinningNumbers, cardNumbers, i);
    }

    return sum;
}

function countMatches(cardWinningNumbers: number[][], cardNumbers: number[][], card: number) {
    let matches = cardNumbers[card].reduce(((acc, val) => cardWinningNumbers[card].includes(val) ? acc + 1 : acc), 0);
    if(matches == 0) { // we have no matches, base case
        // console.log(`Card ${card+1} has no matches`);
        return 1;
    }

    let copies = 0;
    for(let i = 1; i <= matches; i++) {
        copies += countMatches(cardWinningNumbers, cardNumbers, card + i);
    }

    // console.log(`Card ${card+1} had ${copies} copies`);
    return 1 + copies;
}
