document.addEventListener('DOMContentLoaded', () => {    
    function updatePuzzleAccess() {
        const completedPuzzles = JSON.parse(localStorage.getItem('completedPuzzles')) || [];
        
        const puzzleNames = completedPuzzles.reduce((acc, puzzle) => {
            acc[puzzle.number] = puzzle.name;
            return acc;
        }, {});

        const puzzle1Link = document.getElementById('puzzle1');
        if (puzzle1Link) {
            puzzle1Link.href = 'puzzle/puzzle1.html';
            puzzle1Link.textContent = `Puzzle 1: ${puzzleNames[1] || 'Start Here'}`;
            puzzle1Link.classList.remove('locked');
        }

        for (let i = 2; i <= completedPuzzles.length + 1; i++) {
            const puzzleLink = document.getElementById(`puzzle${i}`);
            if (puzzleLink) {
                if (puzzleNames[i]) {
                    puzzleLink.href = `puzzle/puzzle${i}.html`;
                    puzzleLink.textContent = `Puzzle ${i}: ${puzzleNames[i]}`;
                    puzzleLink.classList.remove('locked');
                } else {
                    puzzleLink.textContent = `[Locked]`;
                    puzzleLink.classList.add('locked');
                }
            }
        }
    }

    updatePuzzleAccess();
});
