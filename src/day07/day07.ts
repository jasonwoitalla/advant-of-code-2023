import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let hands: [string, number, number][] = [];

    let customAsciiMap: Record<string, number> = {
        'A': 14,
        'K': 13,
        'Q': 12,
        'J': 11,
        'T': 10
    }

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let parts = line.split(" ");
        hands.push([parts[0], parseInt(parts[1]), getPower(parts[0])]);
    });

    hands = hands.sort((a: [string, number, number], b: [string, number, number]) => {
        if(a[2] < b[2]) {
            return -1;
        } else if(a[2] > b[2]) {
            return 1;
        }

        // Same kind of hand, tie breaker logic
        for(let i = 0; i < a[0].length; i++) {
            let aCharacter = isNaN(parseInt(a[0].charAt(i))) ? customAsciiMap[a[0].charAt(i)] : parseInt(a[0].charAt(i));
            let bCharacter = isNaN(parseInt(b[0].charAt(i))) ? customAsciiMap[b[0].charAt(i)] : parseInt(b[0].charAt(i));

            if(aCharacter < bCharacter) {
                return -1;
            } else if(aCharacter > bCharacter) {
                return 1;
            }
        }

        return 0;
    });

    console.log("Hands: [");
    hands.forEach((hand) => console.log(`    [${hand}],`));
    console.log("]");

    let sum = hands.reduce((acc, val, i) => acc + (val[1] * (i+1)), 0);
    return sum;
}

export async function part2() {
    let hands: [string, number, number][] = [];

    let customAsciiMap: Record<string, number> = {
        'A': 14,
        'K': 13,
        'Q': 12,
        'T': 10,
        'J': 1,
    }

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let parts = line.split(" ");
        hands.push([parts[0], parseInt(parts[1]), getPowerPart2(parts[0])]);
    });

    hands = hands.sort((a: [string, number, number], b: [string, number, number]) => {
        if(a[2] < b[2]) {
            return -1;
        } else if(a[2] > b[2]) {
            return 1;
        }

        // Same kind of hand, tie breaker logic
        for(let i = 0; i < a[0].length; i++) {
            let aCharacter = isNaN(parseInt(a[0].charAt(i))) ? customAsciiMap[a[0].charAt(i)] : parseInt(a[0].charAt(i));
            let bCharacter = isNaN(parseInt(b[0].charAt(i))) ? customAsciiMap[b[0].charAt(i)] : parseInt(b[0].charAt(i));

            if(aCharacter < bCharacter) {
                return -1;
            } else if(aCharacter > bCharacter) {
                return 1;
            }
        }

        return 0;
    });

    console.log("Hands: [");
    hands.forEach((hand) => console.log(`    [${hand}],`));
    console.log("]");

    let sum = hands.reduce((acc, val, i) => acc + (val[1] * (i+1)), 0);
    return sum;
}

// Returns the type of hand this card is, in an integer format
// Five of a kind: 7 | Four of a kind: 6 | Full House: 5 | Three of a kind: 4 | Two pair: 3 | One pair: 2 | High Card: 1
function getPower(card: string): number {
    let sorted = card.split('').sort().join('');

    if(sorted[0] == sorted[4]) { // five of a kind
        return 7;
    }

    if(sorted.match(/(\w)\1\1\1/g)) { // four of a kind
        return 6;
    }

    if((sorted[0] == sorted[2] && sorted[3] == sorted[4]) || (sorted[0] == sorted[1] && sorted[2] == sorted[4])) { // full house
        return 5;
    }

    if(sorted.match(/(\w)\1\1/g)) { // three of a kind
        return 4;
    }

    let numPairs = 0;
    for(let i = 0; i < sorted.length - 1; i++) {
        if(sorted[i] == sorted[i+1])
            numPairs += 1;
    }

    if(numPairs == 2) {
        // console.log(`${card} is two pair`);
        return 3;
    } else if(numPairs == 1) {
        // console.log(`${card} is one pair`);
        return 2;
    }

    // console.log(`${card} is high card`);
    return 1;
}

// Returns the type of hand this card is, in an integer format
// Five of a kind: 7 | Four of a kind: 6 | Full House: 5 | Three of a kind: 4 | Two pair: 3 | One pair: 2 | High Card: 1
function getPowerPart2(card: string): number {
    let counts: Record<string, number> = {};
    card.split('').forEach((c) => counts[c] = counts[c] ? counts[c] + 1 : 1);
    
    let wildCards = counts['J'] ? counts['J'] : 0;
    if(counts['J']) {
        delete counts['J'];
    }
    let items: [string, number][] = Object.keys(counts).map((key) => [key, counts[key]]);
    if(items.length > 0) {
        items = items.sort((a, b) => b[1] - a[1]);
    } else {
        items.push(['', 0]);
        items.push(['', 0]);
    }

    if(items[0][1] + wildCards == 5) { // five of a kind
        return 7;
    }

    if(items[0][1] + wildCards == 4) { // four of a kind
        return 6;
    }

    if(items[0][1] + wildCards == 3 && items[1][1] == 2) { // full house
        return 5;
    }

    if(items[0][1] + wildCards == 3) { // three of a kind
        return 4;
    }

    if((items[0][1] + wildCards == 2 && items[1][1] == 2) || (items[0][1] == 2 && items[1][1] + wildCards == 2)) {
        return 3;
    }

    if(items[0][1] + wildCards == 2) {
        return 2;
    }

    return 1;
}

/**
 * Attempted Answers:
 * 
 * Part 1:
 * 248720331 (too high)
 * 248559379 (correct)
 * 
 * Part 2:
 * 252097541 (too high)
 * 248394654 (too low)
 * 249631254 (correct)
 */
