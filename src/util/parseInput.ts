import * as fs from 'fs';
import * as readline from 'readline';

export function parseLinesFromInput(filePath: string, callback: (line: string) => void): Promise<void> {    
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        rl.on('line', line => {
            callback(line);
        });

        rl.on('close', () => {
            resolve();
        });

        rl.on('error', error => {
            reject(error);
        })
    });
}
