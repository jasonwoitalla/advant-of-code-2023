import colors from 'colors';

const day = process.env.npm_config_aoc ?? '0';
const part = process.env.npm_config_part ?? '0';

const solution = import(`./day${day.toString().padStart(2, '0')}/day${day.toString().padStart(2, '0')}`);
solve(Number(day), part, solution);

export default async function solve(day: Number, part: string, solution: any) {
    const { part1, part2 } = await solution;

    console.log(colors.bold.green(`ADVENT OF CODE 2023`));

    if(part == '1' || part == '0') {
        console.log(colors.green(`🎄🎄 DAY ${day} PART ONE 🎄🎄`));
        let startTime = performance.now();
        let part1Result = await part1();
        let endTime = performance.now();
        console.log(`Solution = ${colors.bold(part1Result.toString())}`);
        console.log(colors.italic(`Time = ${(endTime - startTime).toFixed(2)}ms\n`));
    }

    if(part == '2' || part == '0') {
        console.log(colors.green(`🎄🎄 DAY ${day} PART TWO 🎄🎄`));
        let startTime = performance.now();
        let part2Result = await part2();
        let endTime = performance.now();
        console.log(`Solution = ${colors.bold(part2Result.toString())}`);
        console.log(colors.italic(`Time = ${(endTime - startTime).toFixed(2)}ms\n`));
    }
}
