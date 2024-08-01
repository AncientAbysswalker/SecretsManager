const path = require('path');

const ipc = require('electron').ipcMain;
const { app, BrowserWindow } = require('electron');

const { puzzleProps } = require('./puzzleProps');
const { puzzleEnum } = require('./puzzleEnum');
const { TitlePuzzleHandler } = require('./WindowHandlers');

module.exports = class SimplePuzzleManager {
    constructor() {
        this.puzzleState = {};
        this.titlePuzzleHandler = new TitlePuzzleHandler('↑↓→←');
    }

    initiatePuzzle(puzzleEnumValue) {
        if (puzzleProps[puzzleEnumValue] == undefined) {
            throw new Error(
                `You have not defined puzzleProps for ${puzzleEnumValue}`
            );
        }

        if (this.puzzleState[puzzleEnumValue] == null) {
            this.puzzleState[puzzleEnumValue] = {
                index: 0,
                maxIndex: puzzleProps[puzzleEnumValue].length - 1,
                activeWindow: null,
            };
            this.createWindowCurrentIndex(puzzleEnumValue);
        } else if (puzzleProps[puzzleEnumValue]['activeWindow'] == null) {
            this.createWindowCurrentIndex(puzzleEnumValue);
        }
    }

    getNextPuzzle(puzzleEnumValue) {
        const currentIndex = this.puzzleState[puzzleEnumValue]['index'];
        const maxIndex = this.puzzleState[puzzleEnumValue]['maxIndex'];
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
        const maxIndex = this.puzzleState[puzzleEnumValue]['maxIndex'];
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
        win.webContents.openDevTools();

        // Load puzzle HTML
        win.loadFile(currentPuzzleProps['path']);

        // Set the current puzzle window to this one (if we need to re-open the puzzle)
        this.puzzleState[puzzleEnumValue]['activeWindow'] = win;

        console.log(`global.dummyMode = ${this.dummyMode};`);
        // Only add handlers for if the puzzle is solved if this is not the final "prize" window
        if (currentIndex < maxIndex) {
            // Inject function to return an IPC event for current puzzle
            // We need to catch because we get an error stating "Error: An object could not be cloned at IpcRendererInternal.send" but it works just fine
            console.log(`global.dummyMode = ${this.dummyMode};`);
            win.webContents
                .executeJavaScript(
                    `global.emitPuzzleSolvedEvent = () => {
                        const { ipcRenderer } = require('electron');
                        ipcRenderer.send('${ipc_event}');
                    };`
                )
                .catch(() => {});

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

        // Special Window Handlers
        if (puzzleEnumValue === puzzleEnum.HANOI) {
            this.titlePuzzleHandler.affectedWindow(win);
        } else if (puzzleEnumValue === puzzleEnum.FOX_MAZE) {
            win.on('move', () => {
                let bounds = win.getBounds();
                win.webContents.send('window-moved', bounds);
            });
        }
    }
};
