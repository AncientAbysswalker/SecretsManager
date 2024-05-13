const ipc = require('electron').ipcMain;
const { app, BrowserWindow } = require('electron');

const puzzlesList = require('./puzzlesList');

module.exports = class WitnessManager {
    constructor() {
        this.fullPuzzleList = puzzlesList;
        this.unsolvedPuzzleList = puzzlesList;
        this.solvedPuzzleList = [];
        this.currentPuzzle = null;
        this.currentPuzzleWindow = null;
        this.puzzlesCompleted = false;
    }

    initiatePuzzles() {
        if (this.currentPuzzle == null) {
            this.currentPuzzle = this.unsolvedPuzzleList.shift();
            this.createNextWindow();
        } else if (this.currentPuzzleWindow == null) {
            this.createNextWindow();
        }
    }

    getNextPuzzle() {
        if (this.unsolvedPuzzleList.length === 0) {
            this.puzzlesCompleted = true;
            this.createNextWindow();
        } else {
            this.currentPuzzle = this.unsolvedPuzzleList.shift();
            this.createNextWindow();
        }
    }

    createNextWindow() {
        if (this.puzzlesCompleted) {
            this.createEndingWindow();
        } else {
            this.createWitnessWindow();
        }
    }

    createWitnessWindow() {
        const puzzleDefinition = this.currentPuzzle;
        const puzzleCols = puzzleDefinition['cols'];
        const puzzleRows = puzzleDefinition['rows'];

        // Create new puzzle window
        const win = new BrowserWindow({
            width: WitnessManager.cellCountToWindowSize(puzzleCols),
            height: WitnessManager.cellCountToWindowSize(puzzleRows) + 20,
            zoomFactor: 0.5,
            resizable: false,
            icon: 'witness/data/favicon_half.png', // Relative to root as this is where electron is initiated
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        // win.webContents.openDevTools();
        win.removeMenu();
        const [x, y] = win.getPosition();
        console.log(x, y);
        const randomOffsetX = getRandomInt(-500, 500);
        const randomOffsetY = getRandomInt(-250, 250);
        win.setPosition(x + randomOffsetX, y + randomOffsetY);
        win.setAlwaysOnTop(true);
        win.show();
        // Load puzzle HTML
        win.loadFile(`witness/play/${puzzleDefinition['hash']}.html`); // Relative to root as this is where electron is initiated

        // Add listener for puzzle completion
        ipc.on(
            `solved_event::${puzzleDefinition['name']}`,
            (event, message) => {
                console.log(message);
                console.log(puzzleDefinition['name']);
                ipc.removeAllListeners(
                    `solved_event::${puzzleDefinition['name']}`
                );
                this.getNextPuzzle(true);
            }
        );

        // Set the current puzzle window to this one (if we need to re-open the puzzle)
        this.currentPuzzleWindow = win;

        // If the current puzzle window is closed prematurely, remove the listener for puzzle completion. Without this, bugs arise with multiple listeners being created
        win.on('close', () => {
            ipc.removeAllListeners(`solved_event::${puzzleDefinition['name']}`);
            if (this.currentPuzzleWindow === win) {
                this.currentPuzzleWindow = null;
            }
        });
    }

    static cellCountToWindowSize(cellCount) {
        const padding = 69;
        const cellSize = 82;
        return 2 * padding + cellCount * cellSize;
    }

    createEndingWindow() {
        console.log('ending!');
    }
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
