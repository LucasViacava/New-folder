document.addEventListener('DOMContentLoaded', () => {
    const lightSource = document.getElementById('lightSource');
    const overlay = document.getElementById('overlay');
    const hiddenMessage = document.getElementById('hiddenMessage');
    const puzzle2Input = document.getElementById('puzzle2Input');
    const puzzle2Submit = document.getElementById('puzzle2Submit');
    const puzzle2Message = document.getElementById('puzzle2Message');

    const hiddenCode = 'revelation';

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        lightSource.style.left = `${x - lightSource.offsetWidth / 2}px`;
        lightSource.style.top = `${y - lightSource.offsetHeight / 2}px`;

        const rect = hiddenMessage.getBoundingClientRect();
        if (
            x > rect.left &&
            x < rect.right &&
            y > rect.top &&
            y < rect.bottom
        ) {
            hiddenMessage.style.color = 'rgb(47, 23, 23)';
        } else {
            hiddenMessage.style.color = 'rgba(0, 0, 0, 0)';
        }
    });

    puzzle2Submit.addEventListener('click', () => {
        const userInput = puzzle2Input.value.trim().toLowerCase();
        if (userInput === hiddenCode) {
            puzzle2Message.classList.add('success');
            puzzle2Message.classList.remove('error');

            markPuzzleAsComplete(2);

            showNextButton();
        } else {
            puzzle2Message.textContent = 'Incorrect. Try again.';
            puzzle2Message.classList.add('error');
            puzzle2Message.classList.remove('success');
        }
    });

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
            window.location.href = '../puzzle/puzzle3.html';
        });
        document.body.appendChild(nextButton);
    }
});
