import { parseLinesFromInput } from '../util/parseInput';

interface MapCoord {
    [key: string]: [string, string]
}

const lcm = (...arr: number[]) => {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
    return [...arr].reduce((a, b) => _lcm(a, b));
  };

export async function part1() {
    let navigationString = '';

    let map: MapCoord = {};

    let lineNum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(lineNum == 0) {
            navigationString = line;
            lineNum = 1;
            return;
        }

        if(line == "") {
            return;
        }

        let treeParts = line.split('=');
        let root = treeParts[0].trim();
        let children = treeParts[1].replace('(', '').replace(')', '').trim().split(',');

        map[root] = [children[0].trim(), children[1].trim()];
    });

    let currentNode = "AAA";
    let endNode = "ZZZ";
    let numSteps = 0;
    let index = 0;

    while(currentNode != endNode) {
        let step = navigationString[index] == 'L' ? 0 : 1;
        currentNode = map[currentNode][step];

        index = (index + 1) % navigationString.length;
        numSteps += 1;
    }

    return numSteps;
}

export async function part2() {
    let navigationString = '';

    let map: MapCoord = {};
    let currentPositions: string[] = [];

    let lineNum = 0;
    await parseLinesFromInput(__dirname + '/input.txt', line => {
        if(lineNum == 0) {
            navigationString = line;
            lineNum = 1;
            return;
        }

        if(line == "") {
            return;
        }

        let treeParts = line.split('=');
        let root = treeParts[0].trim();
        let children = treeParts[1].replace('(', '').replace(')', '').trim().split(',');

        map[root] = [children[0].trim(), children[1].trim()];
        if(root[root.length-1] == "A") {
            currentPositions.push(root);
        }
    });

    let myLcm = 0;
    let answers: number[] = currentPositions.map((key) => findSteps(key, map, navigationString));
    myLcm = lcm(...answers); 

    return myLcm;
}

function findSteps(startNode: string, map: MapCoord, navigation: string): number {
    let currentNode = startNode;
    let numSteps = 0;
    let index = 0;

    while(!isAtEnd(currentNode)) {
        let step = navigation[index] == 'L' ? 0 : 1;
        currentNode = map[currentNode][step];

        index = (index + 1) % navigation.length;
        numSteps += 1;
    }

    return numSteps;
}

function isAtEnd(node: string): boolean {
    return node[node.length - 1] == "Z";
}
