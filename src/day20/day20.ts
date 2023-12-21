import { parseLinesFromInput } from '../util/parseInput';
import colors from 'colors';

var messageQueue: ActionInput[] = [];

enum Signal {
    HIGH = "high",
    LOW = "low",
};

type ActionInput = {
    module: Module,
    from: string,
    signal: Signal,
}

type Module = {
    name: string,
    state: Signal,
    connectionNames: Array<string>,
    connections: Array<Module>,
    memory: Map<string, Signal>,
    action: any,
};

function flipFlop(input: ActionInput, connections: Array<Module>) {
    if(input.signal === Signal.HIGH) { // guard clause
        return;
    }

    input.module.state = input.module.state === Signal.LOW ? Signal.HIGH : Signal.LOW;

    for(let module of connections) {
        let newInput: ActionInput = {
            module: module,
            from: input.module.name,
            signal: input.module.state,
        };

        // console.log(`${input.module.name} -${input.module.state}-> ${module.name}`);
        messageQueue.push(newInput);
    }
}

function conjunction(input: ActionInput, connections: Array<Module>) {
    input.module.memory.set(input.from, input.signal);

    let theSignal = Signal.LOW;
    for(let [name, signal] of input.module.memory) {
        if(signal === Signal.LOW) {
            theSignal = Signal.HIGH;
            break;
        }
    }

    for(let module of connections) {
        let newInput: ActionInput = {
            module: module,
            from: input.module.name,
            signal: theSignal,
        };

        // console.log(`${input.module.name} -${theSignal}-> ${module.name}`);
        messageQueue.push(newInput);
    }
}

// Broadcast a low signal to all the connected modules
function broadcast(_input: ActionInput, connections: Array<Module>) {
    for(let module of connections) {
        let input: ActionInput = {
            module: module,
            from: 'broadcaster',
            signal: Signal.LOW,
        }

        // console.log('broadcaster -low-> ' + module.name);
        messageQueue.push(input);
    }
}

export async function part1() {
    let modules: Map<string, Module> = new Map();

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let io = line.split(' -> ');
        let action = broadcast;
        switch (io[0][0]) {
            case '%':
                action = flipFlop;
                break;
            case '&':
                action = conjunction;
                break;
            case 'b': // pad out the b so it doesn't get chopped off later
                io[0] = ' ' + io[0];
                break;
        }

        let module: Module = {
            name: io[0].substring(1),
            state: Signal.LOW,
            connectionNames: io[1].split(', '),
            connections: [],
            memory: new Map(),
            action: action,
        };

        modules.set(module.name, module);
    });

    // Complete connections
    for(let module of modules.values()) {
        for(let connectionName of module.connectionNames) {
            let connection = modules.get(connectionName);
            if(connection) {
                module.connections.push(connection);
            } else { // make a blank module for this connection
                let blankModule: Module = {
                    name: connectionName,
                    state: Signal.LOW,
                    connectionNames: [],
                    connections: [],
                    memory: new Map(),
                    action: null,
                };
                module.connections.push(blankModule);
            }
        }
    }

    // Fill out memory maps by finding all modules that output to me
    for(let module of modules.values()) {
        for(let otherModule of modules.values()) {
            if(otherModule.connectionNames.includes(module.name)) {
                module.memory.set(otherModule.name, Signal.LOW);
            }
        }
    }
    
    let lowSignals = 0;
    let highSignals = 0;

    // Push our button 1000 times
    for(let i = 0; i < 1000; i++) {
        let broadcaster = modules.get('broadcaster')!;
        let broadcastMessage: ActionInput = {
            module: broadcaster,
            from: 'button',
            signal: Signal.LOW,
        };
        messageQueue.push(broadcastMessage);
        // console.log('button -low-> broadcaster');

        while(messageQueue.length > 0) {
            let input = messageQueue.shift()!;
            if(input.signal === Signal.LOW) {
                lowSignals++;
            } else if(input.signal === Signal.HIGH) {
                highSignals++;
            }

            let module = modules.get(input.module.name);
            if(module && module.action) {
                module.action(input, module.connections, module.memory);
            }
        }
    }

    return lowSignals * highSignals;
}

function printMessageQueue() {
    console.log(colors.green('Message Queue:'));
    for(let message of messageQueue) {
        console.log(colors.green(`       from ${message.from}: ${message.module.name} -${message.signal}`));
    }
}

export async function part2() {
    let modules: Map<string, Module> = new Map();

    await parseLinesFromInput(__dirname + '/input.txt', line => {
        let io = line.split(' -> ');
        let action = broadcast;
        switch (io[0][0]) {
            case '%':
                action = flipFlop;
                break;
            case '&':
                action = conjunction;
                break;
            case 'b': // pad out the b so it doesn't get chopped off later
                io[0] = ' ' + io[0];
                break;
        }

        let module: Module = {
            name: io[0].substring(1),
            state: Signal.LOW,
            connectionNames: io[1].split(', '),
            connections: [],
            memory: new Map(),
            action: action,
        };

        modules.set(module.name, module);
    });

    // Complete connections
    for(let module of modules.values()) {
        for(let connectionName of module.connectionNames) {
            let connection = modules.get(connectionName);
            if(connection) {
                module.connections.push(connection);
            } else { // make a blank module for this connection
                let blankModule: Module = {
                    name: connectionName,
                    state: Signal.LOW,
                    connectionNames: [],
                    connections: [],
                    memory: new Map(),
                    action: null,
                };
                module.connections.push(blankModule);
            }
        }
    }

    // Fill out memory maps by finding all modules that output to me
    for(let module of modules.values()) {
        for(let otherModule of modules.values()) {
            if(otherModule.connectionNames.includes(module.name)) {
                module.memory.set(otherModule.name, Signal.LOW);
            }
        }
    }

    let rxFeed;
    for(let module of modules.values()) {
        if(module.connectionNames.includes('rx')) {
            rxFeed = module;
            break;
        }
    }

    let cycles: Map<string, number> = new Map();
    for(let module of modules.values()) {
        if(module.connectionNames.includes(rxFeed!.name)) {
            cycles.set(module.name, -1);
        }
    }
    
    // Print cycles
    for(let [name, cycle] of cycles) {
        console.log(`${name}: ${cycle}`);
    }

    let count = 0;
    while(true) {
        count += 1;
        let broadcaster = modules.get('broadcaster')!;
        let broadcastMessage: ActionInput = {
            module: broadcaster,
            from: 'button',
            signal: Signal.LOW,
        };
        messageQueue.push(broadcastMessage);

        while(messageQueue.length > 0) {
            let input = messageQueue.shift()!;

            if(input.module.name === rxFeed!.name && input.signal === Signal.HIGH) {
                if(cycles.get(input.from) === -1) {
                    cycles.set(input.from, count);
                }                
            }

            let module = modules.get(input.module.name);
            if(module && module.action) {
                module.action(input, module.connections, module.memory);
            }
        }

        let allCycles = true;
        for(let [name, cycle] of cycles) {
            if(cycle === -1) {
                allCycles = false;
            }
        }

        if(allCycles) {
            break;
        }
    }

    let cyclesArray = Array.from(cycles.values());
    console.log(cyclesArray);
    return lcm(...cyclesArray);
}

const lcm = (...arr: number[]) => {
    const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
    const _lcm = (x: number, y: number) => (x * y) / gcd(x, y);
    return [...arr].reduce((a, b) => _lcm(a, b));
};

/**
 * Attempted Answers:
 * 
 */
