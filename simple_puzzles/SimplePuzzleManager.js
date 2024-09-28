const path = require('path');

const ipc = require('electron').ipcMain;
const { BrowserWindow } = require('electron');

const { puzzleProps } = require('./puzzleProps');
const { puzzleEnum } = require('./puzzleEnum');
const { TitlePuzzleHandler, IncrementalWindowResizeHandler } = require('./WindowHandlers');

module.exports = class SimplePuzzleManager {
    constructor() {
        this.puzzleState = {};
    }

    initiatePuzzle(puzzleEnumValue) {
        if (puzzleProps[puzzleEnumValue] == undefined) {
            throw new Error(
                `You have not defined puzzleProps for ${puzzleEnumValue}`
            );
        }

        if (this.puzzleState[puzzleEnumValue] == null) {
            this.puzzleState[puzzleEnumValue] = {
                currentIndex: 0,
                checkpointIndex: 0,
                maxIndex: puzzleProps[puzzleEnumValue].length - 1,
                activeWindow: null,
            };
            this.createWindowCurrentIndex(puzzleEnumValue);
        } else if (this.puzzleState[puzzleEnumValue]['activeWindow'] == null) {
            this.puzzleState[puzzleEnumValue]['currentIndex'] = this.puzzleState[puzzleEnumValue]['checkpointIndex'];
            this.createWindowCurrentIndex(puzzleEnumValue);
        }
    }

    getNextPuzzle(puzzleEnumValue) {
        const currentIndex = this.puzzleState[puzzleEnumValue]['currentIndex'];
        const maxIndex = this.puzzleState[puzzleEnumValue]['maxIndex'];
        if (currentIndex < maxIndex) {
            this.puzzleState[puzzleEnumValue]['activeWindow'].close();
            this.puzzleState[puzzleEnumValue]['currentIndex'] = currentIndex + 1;
            if (!puzzleProps[puzzleEnumValue][currentIndex + 1]['ignoreCheckpoint']) {
                this.puzzleState[puzzleEnumValue]['checkpointIndex'] = currentIndex + 1;
            }
            this.createWindowCurrentIndex(puzzleEnumValue);
        } else {
            console.error(
                "You should not be able to solve the final window, as this is the 'prize' window"
            );
        }
    }

    createWindowCurrentIndex(puzzleEnumValue) {
        const currentIndex = this.puzzleState[puzzleEnumValue]['currentIndex'];
        const maxIndex = this.puzzleState[puzzleEnumValue]['maxIndex'];
        const ipc_event = `spm::evt::solved::${puzzleEnumValue}::${currentIndex}`;

        // Get the current puzzle props
        let currentPuzzleProps = puzzleProps[puzzleEnumValue][currentIndex];

        // Create the puzzle window
        const iconPath = path.join(__dirname, currentPuzzleProps['icon']);
        const win = new BrowserWindow({
            useContentSize: true,
            width: currentPuzzleProps['w'],
            height: currentPuzzleProps['h'],
            resizable: false,
            minimizable: false,
            maximizable: false,
            icon: iconPath,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        win.removeMenu();
        win.setAlwaysOnTop(true);
        // win.webContents.openDevTools();

        // Load puzzle HTML
        win.loadFile(currentPuzzleProps['path']);

        // Set the current puzzle window to this one (if we need to re-open the puzzle)
        this.puzzleState[puzzleEnumValue]['activeWindow'] = win;

        // Only add handlers for if the puzzle is solved if this is not the final "prize" window
        if (currentIndex < maxIndex) {
            // Inject function to return an IPC event for current puzzle
            // We need to catch because we get an error stating "Error: An object could not be cloned at IpcRendererInternal.send" but it works just fine
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
        }

        // If the current puzzle window is closed prematurely, remove the listener for puzzle completion. Without this, bugs arise with multiple listeners being created
        win.on('close', () => {
            ipc.removeAllListeners(ipc_event);
            if (this.puzzleState[puzzleEnumValue]['activeWindow'] === win) {
                this.puzzleState[puzzleEnumValue]['activeWindow'] = null;
            }        
        });

        // Special Window Handlers
        if (puzzleEnumValue === puzzleEnum.HANOI) {
            const titlePuzzleHandler = new TitlePuzzleHandler(win, '→→→←↑→↓→←↑←↑'); // RIGHT, RIGHT, RIGHT, LEFT, UP, RIGHT, DOWN, RIGHT, LEFT, UP, LEFT, UP
        } else if (puzzleEnumValue === puzzleEnum.FOX_MAZE) {
            // Handle moving window as viewing pane
            win.on('move', () => {
                let bounds = win.getBounds();
                win.webContents.send('window-moved', bounds);
            });
            win.setPosition(50, 50);

            // Add listener for increasing the window's size
            const incrementalWindowResizeHandler = new IncrementalWindowResizeHandler(
                win, currentPuzzleProps['w'], currentPuzzleProps['h'], 64, 64);
            ipc.on('fox_maze_increase_size', (event, message) => {
                incrementalWindowResizeHandler.increaseWindowSize();
            });
            win.on('close', () => {
                ipc.removeAllListeners('fox_maze_increase_size');
            });
        }
    }
};
