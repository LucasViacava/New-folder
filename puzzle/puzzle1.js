document.addEventListener('DOMContentLoaded', () => {
    const scratchCanvas = document.getElementById('scratchCanvas');
    const ctx = scratchCanvas.getContext('2d');
    const passwordInput = document.getElementById('passwordInput');
    const submitButton = document.getElementById('submitButton');
    const message = document.getElementById('message');

    const hiddenMessage = 'darkness';

    function initScratchCard() {
        ctx.fillStyle = '#888';
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        ctx.font = 'bold 30px Courier';
        ctx.fillStyle = '#000';
        ctx.fillText('PASSWORD', 80, 60);

        ctx.globalCompositeOperation = 'destination-out';
    }

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function getTouchPos(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function scratch(e) {
        const pos = getTouchPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
        ctx.fill();

        lastX = pos.x;
        lastY = pos.y;
    }

    scratchCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getTouchPos(e);
        lastX = pos.x;
        lastY = pos.y;
        scratch(e);
    });

    scratchCanvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            scratch(e);
        }
    });

    scratchCanvas.addEventListener('mouseup', () => {
        isDrawing = false;
        checkScratchCompletion();
    });

    scratchCanvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const pos = getTouchPos(e);
        lastX = pos.x;
        lastY = pos.y;
        scratch(e);
    });

    scratchCanvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            scratch(e);
        }
        e.preventDefault();
    });

    scratchCanvas.addEventListener('touchend', () => {
        isDrawing = false;
        checkScratchCompletion();
    });

    function checkScratchCompletion() {
        const imageData = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        let totalPixels = imageData.data.length / 4;
        let transparentPixels = 0;

        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) {
                transparentPixels++;
            }
        }

        if ((transparentPixels / totalPixels) > 0.5) {
            revealPasswordHint();
        }
    }

    function revealPasswordHint() {
        ctx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#0e0e0e';
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        ctx.fillStyle = '#4caf50';
        ctx.fillText('DARKNESS', 80, 60);
        scratchCanvas.style.pointerEvents = 'none';
    }

    submitButton.addEventListener('click', () => {
        const userInput = passwordInput.value.trim().toLowerCase();
        if (userInput === hiddenMessage) {
            message.classList.add('success');
            message.classList.remove('error');

            markPuzzleAsComplete(1);

            showNextButton();
        } else {
            message.textContent = 'Incorrect password. Please try again';
            message.classList.add('error');
            message.classList.remove('success');
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
            window.location.href = '../puzzle/puzzle2.html';
        });
        document.body.appendChild(nextButton);
    }

    initScratchCard();
});
