const readline = require('readline');

class TerminalUI {
    constructor() {
        this.currentOption = 0;
    }

    clear() {
        process.stdout.write('\x1Bc');
    }

    drawBox(title, options, selectedIndex) {
        const width = 48;
        const border = '═'.repeat(width - 2);

        console.log(`╔${border}╗`);
        console.log(`║${title.padStart((width + title.length) / 2).padEnd(width - 2)}║`);
        console.log(`╠${border}╣`);
        console.log(`║${' '.repeat(width - 2)}║`);

        options.forEach((option, index) => {
            const prefix = index === selectedIndex ? '> ' : '  ';
            const text = `${prefix}${index + 1}. ${option}`;
            const padding = ' '.repeat(width - 2 - text.length);
            console.log(`║${text}${padding}║`);
        });

        console.log(`║${' '.repeat(width - 2)}║`);
        console.log(`╚${border}╝`);
    }

    async prompt(question) {
        return new Promise(resolve => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    async waitForKey() {
        return new Promise(resolve => {
            process.stdin.once('data', data => {
                resolve(data.toString());
            });
        });
    }

    pause() {
        console.log('\nPress any key to return to menu...');
        return this.waitForKey();
    }
}

module.exports = TerminalUI;
