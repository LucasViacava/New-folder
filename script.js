// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const scratchCanvas = document.getElementById('scratchCanvas');
    const ctx = scratchCanvas.getContext('2d');
    const passwordInput = document.getElementById('passwordInput');
    const submitButton = document.getElementById('submitButton');
    const message = document.getElementById('message');

    const hiddenMessage = 'oscuridad'; // The correct password

    // Initialize Scratch Card
    function initScratchCard() {
        // Fill canvas with gray overlay
        ctx.fillStyle = '#888';
        ctx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

        // Add hidden text
        ctx.font = 'bold 30px Courier';
        ctx.fillStyle = '#000';
        ctx.fillText('CONTRASEÑA', 50, 60);

        // Add scratchable overlay
        ctx.globalCompositeOperation = 'destination-out';
    }

    let isDrawing = false;

    scratchCanvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
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

    function scratch(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
    }

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
        ctx.fillText('OSCURIDAD', 80, 60);
        scratchCanvas.style.pointerEvents = 'none';
    }

    submitButton.addEventListener('click', () => {
        const userInput = passwordInput.value.trim().toLowerCase();
        if (userInput === hiddenMessage) {
            message.textContent = 'Acceso concedido! Bienvenida';
            message.classList.add('success');
            message.classList.remove('error');
            setTimeout(function() {
                location.replace('https://wa.me/541165354682');
            },3000)
            // Proceed to next step or reveal more content
        } else {
            message.textContent = 'Contraseña incorrecta. Vuelve a intentar';
            message.classList.add('error');
            message.classList.remove('success');
        }
    });

    // Initialize everything
    initScratchCard();
});
