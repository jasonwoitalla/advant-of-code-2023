import { parseLinesFromInput } from '../util/parseInput';

export async function part1() {
    let sumOfPossibleGames = 0;

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let parts = line.split(':');
        let gameId = Number(parts[0].replace('Game ', '').trim());

        let subsets = parts[1].split(';');

        let maxRed = 12;
        let maxGreen = 13;
        let maxBlue = 14;

        let possible = true;
        for(let subset of subsets) {
            let cubes = subset.split(',');
            let totalRed = 0;
            let totalGreen = 0;
            let totalBlue = 0;

            for(let cube of cubes) {
                let cubeParts = cube.trim().split(' ');
                let color = cubeParts[1].trim();
                let count = Number(cubeParts[0].trim());
                if(color === 'red') {
                    totalRed += count;
                } else if(color === 'green') {
                    totalGreen += count;
                } else if(color === 'blue') {
                    totalBlue += count;
                }
            }

            if(totalRed > maxRed || totalGreen > maxGreen || totalBlue > maxBlue) {
                possible = false;
                break;
            }

            // console.log("Game " + gameId + " has " + totalRed + " red, " + totalGreen + " green, " + totalBlue + " blue");
        }

        if(possible) {
            // console.log("Game " + gameId + " is possible");
            sumOfPossibleGames += gameId;
        }
    });

    return sumOfPossibleGames;
}

export async function part2() {
    let sumOfPossibleGames = 0;

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let parts = line.split(':');
        let gameId = Number(parts[0].replace('Game ', '').trim());

        let subsets = parts[1].split(';');

        let maxRed = 0;
        let maxGreen = 0;
        let maxBlue = 0;

        let possible = true;
        for(let subset of subsets) {
            let cubes = subset.split(',');

            for(let cube of cubes) {
                let cubeParts = cube.trim().split(' ');
                let color = cubeParts[1].trim();
                let count = Number(cubeParts[0].trim());
                if(color === 'red' && count > maxRed) {
                    maxRed = count;
                } else if(color === 'green' && count > maxGreen) {
                    maxGreen = count;
                } else if(color === 'blue' && count > maxBlue) {
                    maxBlue = count;
                }
            }
            // console.log("Game " + gameId + " has " + totalRed + " red, " + totalGreen + " green, " + totalBlue + " blue");
        }

        let power = maxRed * maxGreen * maxBlue;
        sumOfPossibleGames += power; 
    });

    return sumOfPossibleGames;
}
