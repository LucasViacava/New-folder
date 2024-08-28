document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    const secretCode = "the art of war"; // Expect this exact phrase (case-insensitive)
    let hintsUsed = 0;
    const clues = [
        "First Clue: Study what the greatest conqueror studied.",
        "Second Clue: Seek the wisdom that guided empires.",
        "Third Clue: The path to victory lies in ancient texts.",
        "Fourth Clue: Unlock the strategy of Sun’s legacy.",
        "Final Clue: A war is won before it begins. Seek the art within."
    ];

    const commands = {
        help: () => "Available commands: 'hint', 'clear', 'unlock <code>'.",
        hint: () => {
            hintsUsed++;
            if (hintsUsed >= clues.length) {
                commands.help = () => "Available commands: 'hint', 'clear', 'unlock <code>', 'strategy'.";
            }
            return clues.shift() || "No more hints available.";
        },
        clear: () => {
            terminalOutput.innerHTML = '';
            return "Terminal cleared.";
        },
        strategy: () => {
            if (hintsUsed >= clues.length) {
                return "Sun Tzu teaches that battles are won by strategy, not just by strength.";
            } else {
                return "Command not recognized: strategy. Type 'help' for a list of commands.";
            }
        },
        unlock: (code) => {
            if (code.toLowerCase() === secretCode) {
                markPuzzleAsComplete();
                showNextButton();
                return "Correct, you unlocked the next puzzle.";
            } else {
                return "Incorrect code. Try again.";
            }
        },
    };

    function executeCommand(input) {
        const [command, ...args] = input.trim().split(' ');
        const code = args.join(' ').toLowerCase(); // Combine arguments into a single string and lowercase it
        if (commands[command]) {
            return commands[command](code);
        } else {
            return `Command not recognized: ${command}. Type 'help' for a list of commands.`;
        }
    }

    function handleInput(event) {
        if (event.key === 'Enter') {
            const input = terminalInput.value.trim();
            if (input) {
                addOutput(`> ${input}`);
                terminalInput.value = '';
                showTypingEffect(() => {
                    const result = executeCommand(input);
                    addOutput(result);
                });
            }
        }
    }

    function addOutput(text) {
        const newLine = document.createElement('div');
        newLine.textContent = text;
        terminalOutput.appendChild(newLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function showTypingEffect(callback) {
        const typingEffect = document.createElement('div');
        typingEffect.textContent = '...';
        terminalOutput.appendChild(typingEffect);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        let dots = 0;
        const interval = setInterval(() => {
            dots = (dots + 1) % 4;
            typingEffect.textContent = '.'.repeat(dots) + ' '.repeat(3 - dots);
        }, 300);

        setTimeout(() => {
            clearInterval(interval);
            typingEffect.remove();
            callback();
        }, 1500);
    }

    function markPuzzleAsComplete() {
        const puzzleName = document.title;

        let completedPuzzles = JSON.parse(localStorage.getItem('completedPuzzles')) || [];
        const puzzleNumber = parseInt(window.location.pathname.match(/puzzle(\d+)/)[1], 10);

        if (!completedPuzzles.some(p => p.number === puzzleNumber)) {
            completedPuzzles.push({
                number: puzzleNumber,
                name: puzzleName
            });
            localStorage.setItem('completedPuzzles', JSON.stringify(completedPuzzles));
        }
    }

    function showNextButton() {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('next-button');
        nextButton.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        document.body.appendChild(nextButton);
    }    

    terminalInput.addEventListener('keydown', handleInput);

    // Initial message
    addOutput("Welcome to the Terminal. Type 'help' to get started.");
});
