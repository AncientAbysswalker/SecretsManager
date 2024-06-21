const ipc = require('electron').ipcMain;
const { app, BrowserWindow } = require('electron');

const { puzzleProps } = require('./puzzleProps');

module.exports = class SimplePuzzleManager {
    constructor() {
        this.puzzleState = {};
    }

    initiatePuzzle(puzzleEnumValue) {
        console.log(puzzleEnumValue);
        if (this.puzzleState[puzzleEnumValue] == null) {
            this.puzzleState[puzzleEnumValue] = {
                index: 0,
                maxIndex: puzzleProps[puzzleEnumValue].length,
                activeWindow: null,
            };
            this.createWindowCurrentIndex(puzzleEnumValue);
        } else if (puzzleProps[puzzleEnumValue]['activeWindow'] == null) {
            this.createWindowCurrentIndex(puzzleEnumValue);
        }
    }

    getNextPuzzle(puzzleEnumValue) {
        const currentIndex = this.puzzleState[puzzleEnumValue]['index'];
        const maxIndex = this.puzzleState[puzzleEnumValue]['maxIndex'] - 1;
        if (currentIndex < maxIndex) {
            this.puzzleState[puzzleEnumValue]['activeWindow'].close();
            this.puzzleState[puzzleEnumValue]['index'] = currentIndex + 1;
            this.createWindowCurrentIndex(puzzleEnumValue);
        } else {
            console.error(
                "You should not be able to solve the final window, as this is the 'prize' window"
            );
        }
    }

    createWindowCurrentIndex(puzzleEnumValue) {
        const currentIndex = this.puzzleState[puzzleEnumValue]['index'];
        const ipc_event = `spm::evt::solved::${puzzleEnumValue}::${currentIndex}`;

        // Get the current puzzle props
        let currentPuzzleProps = puzzleProps[puzzleEnumValue][currentIndex];

        // Create the puzzle window
        const win = new BrowserWindow({
            useContentSize: true,
            width: currentPuzzleProps['w'],
            height: currentPuzzleProps['h'],
            resizable: false,
            icon: currentPuzzleProps['icon'],
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        win.removeMenu();
        win.setAlwaysOnTop(true);
        win.show();

        // Load puzzle HTML
        win.loadFile(currentPuzzleProps['path']);

        // Set the current puzzle window to this one (if we need to re-open the puzzle)
        this.puzzleState[puzzleEnumValue]['activeWindow'] = win;

        // Inject IPC event name for current puzzle as a global variable
        win.webContents.executeJavaScript(
            `global.ipc_event_name = '${ipc_event}';`
        );

        // Add listener for puzzle completion
        ipc.on(ipc_event, (event, message) => {
            ipc.removeAllListeners(ipc_event);
            this.getNextPuzzle(puzzleEnumValue);
        });

        // If the current puzzle window is closed prematurely, remove the listener for puzzle completion. Without this, bugs arise with multiple listeners being created
        win.on('close', () => {
            ipc.removeAllListeners(ipc_event);
            if (this.puzzleState[puzzleEnumValue]['activeWindow'] === win) {
                this.puzzleState[puzzleEnumValue]['activeWindow'] = null;
            }
        });
    }
};
