/**
 * A script that will create my advent of code repo template. It will create a folder for each day and inside creates an empty typescript file for that day,
 * an empty input.txt file, an empty example.txt and an empty README.md file.
 */

import * as fs from 'fs';
import * as path from 'path';

export default function createTemplate() {
    for(let i = 2; i <= 25; i++) {
        let day = i.toString().padStart(2, '0');
        let dayFolder = path.join(__dirname, `../day${day}`);
        fs.mkdirSync(dayFolder);

        let dayFile = path.join(dayFolder, `day${day}.ts`);
        fs.writeFileSync(dayFile, "");

        let input = path.join(dayFolder, `input.txt`);
        fs.writeFileSync(input, "");

        let example = path.join(dayFolder, `example.txt`);
        fs.writeFileSync(example, "");

        let readme = path.join(dayFolder, `README.md`);
        fs.writeFileSync(readme, "");
    }
}

createTemplate();
