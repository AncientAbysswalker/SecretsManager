const { ipcRenderer } = require('electron')

function arrowTextToArrow(arrowText) {
    switch (arrowText) {
        case 'UP ARROW':
            return '🡱';
        case 'DOWN ARROW':
            return '🡳';
        case 'LEFT ARROW':
            return '🡰';
        case 'RIGHT ARROW':
            return '🡲';
        case 'UP AND RIGHT':
            return '🡵';
        case 'UP AND LEFT':
            return '🡴';
        case 'DOWN AND RIGHT':
            return '🡶';
        case 'DOWN AND LEFT':
            return '🡷';
        case 'INVALID':
            return '?';
      default:
        return arrowText;
    }
}

const textColor = '#b1fd00';
const textShadowColor = '#e2ffb7';
const textShadowStyle = (color) => `1px 1px 2px ${color}, 0 0 1em ${color}, 0 0 0.2em ${color}`;
const screenColor = '#008000';

const inputText = document.getElementById("console");
const cursorText = document.getElementById("cursor");

ipcRenderer.on('arrow-pressed', (event, arrowText) => {
    const arrow = arrowTextToArrow(arrowText);
    inputText.innerText = inputText.innerText + arrow;
    startCountdown();
});

ipcRenderer.on('buffer-arrow-pressed', (event, arrowText) => {
    const arrow = arrowTextToArrow(arrowText);
    cursorText.innerText = [...cursorText.innerText][1] + arrow;
});

ipcRenderer.on('buffer-on', (event) => {
    cursorText.innerText = 'abc';
    cursorText.classList.add("buffer-cursor");
    cursorText.classList.remove("blinking-cursor");
});

ipcRenderer.on('buffer-off', (event) => {
    cursorText.innerText = '_';
    cursorText.classList.add("blinking-cursor");
    cursorText.classList.remove("buffer-cursor");
});

// Fade out timer
let countdownTimer;
let resetFlag = false;

function startCountdown() {
  // Reset previous transition
  inputText.style.transition = "none";
  inputText.style.color = textColor;
  inputText.style.textShadow = textShadowStyle(textShadowColor);

  // Start transition and countdown
  setTimeout(() => {
    inputText.style.transition = "color 5s ease-in, text-shadow 5s ease-in";
    inputText.style.color = screenColor;
    inputText.style.textShadow = textShadowStyle(screenColor);
  }, 10); // Slight delay to allow transition to reset

  // Clear previous countdown if it's running
  if (countdownTimer) {
    clearTimeout(countdownTimer);
  }

  countdownTimer = setTimeout(() => {
    if (!resetFlag) {
        inputText.textContent = "";
    }
    resetFlag = false;
  }, 4950); // 5 seconds fade out
}