const { app, BrowserWindow, globalShortcut } = require('electron');
// const nodeAbi = require('node-abi')

const ipc = require('electron').ipcMain;

const { GlobalKeyboardListener } = require('node-global-key-listener');
const v = new GlobalKeyboardListener();

const puzzlesList = [
    {
        name: 'TOO EASY LOL',
        hash: 'NEEV6DHM',
        size: 384,
    },
    {
        name: 'Hidden Path',
        hash: 'XLUMVWBS',
        size: 466,
    },
    {
        name: 'Got it all?',
        hash: 'T6NB5ZNN',
        size: 712,
    },
];

// LEGACY: For registering with globalShortcut
// const arrowKeys = Object.freeze({
//     UP: 'Up',
//     DOWN: 'Down',
//     LEFT: 'Left',
//     RIGHT: 'Right',
// });

const arrowKeys = Object.freeze({
    UP: 'UP ARROW',
    DOWN: 'DOWN ARROW',
    LEFT: 'LEFT ARROW',
    RIGHT: 'RIGHT ARROW',
});

class WitnessManager {
    constructor() {
        this.fullPuzzleList = puzzlesList;
        this.unsolvedPuzzleList = puzzlesList;
        this.solvedPuzzleList = [];
        this.currentPuzzle = null;
        this.currentPuzzleWindow = null;
    }

    initiatePuzzles() {
        if (this.currentPuzzle == null) {
            this.currentPuzzle = this.unsolvedPuzzleList.shift();
            this.createWitnessWindow(this.currentPuzzle);
        } else if (this.currentPuzzleWindow == null) {
            this.createWitnessWindow(this.currentPuzzle);
        }
    }

    getNextPuzzle() {
        this.currentPuzzle = this.unsolvedPuzzleList.shift();
        this.createWitnessWindow(this.currentPuzzle);
    }

    createWitnessWindow(puzzleDefinition) {
        const win = new BrowserWindow({
            width: puzzleDefinition['size'],
            height: puzzleDefinition['size'] + 20,
            zoomFactor: 0.5,
            resizable: false,
            icon: 'witness/data/favicon_half.png',
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
        });
        // win.webContents.openDevTools();
        win.removeMenu();
        win.setPosition(5, 5);

        console.log(puzzleDefinition);
        win.loadFile(`witness/play/${puzzleDefinition['hash']}.html`);

        // Handler for puzzle solve
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
        // win.webContents.on("solved_event", function(arg1, arg2){

        //     console.log(arg1, arg2); // this will print inside parent_window devtools console
        // });
        // win.loadFile('witness/play/T6NB5ZNN.html')

        this.currentPuzzleWindow = win;

        win.on('close', () => {
            ipc.removeAllListeners(`solved_event::${puzzleDefinition['name']}`);
            if (this.currentPuzzleWindow === win) {
                this.currentPuzzleWindow = null;
            }
        });
    }
}

const goldenPaths = [
    {
        path: [arrowKeys.UP, arrowKeys.UP, arrowKeys.UP, arrowKeys.DOWN],
        action: () => {
            witnessManager.initiatePuzzles();
        },
    },
];

class GoldenPathManager {
    pathTimeout = 5 * 1000;

    constructor(app) {
        this.app = app;
        this.currentTime = 0;
        this.currentIndex = 0;
        this.remainingPaths = [];

        app.whenReady().then(() => {
            // LEGACY: For registering with globalShortcut
            // for (const arrowKey of Object.values(arrowKeys)) {
            //     console.log(arrowKey);
            //     globalShortcut.register(arrowKey, () =>
            //         this.pressedArrowKey(arrowKey)
            //     );
            // }
            const gpm = this;
            v.addListener(function (e, down) {
                if (
                    e.state == 'DOWN' &&
                    Object.values(arrowKeys).includes(e.name)
                ) {
                    console.log(e.name);
                    console.log(9);
                    gpm.pressedArrowKey(e.name);
                }
            });
        });
    }

    pressedArrowKey(arrowKey) {
        console.log(arrowKey);
        const now = Date.now();
        if (now - this.currentTime > this.pathTimeout) {
            this.currentIndex = 0;
            this.remainingPaths = goldenPaths.slice(0);
        }

        this.currentTime = now;

        for (let i = this.remainingPaths.length - 1; i >= 0; i--) {
            let possiblePath = this.remainingPaths[i];
            if (possiblePath['path'][this.currentIndex] != arrowKey) {
                this.remainingPaths.splice(i, 1);
            } else if (possiblePath['path'].length == this.currentIndex + 1) {
                possiblePath['action']();
            }
        }

        this.currentIndex += 1;
    }
}

const goldenPathManager = new GoldenPathManager(app);
const witnessManager = new WitnessManager();

app.whenReady().then(() => {
    // console.log(nodeAbi.getAbi('15.14.0', 'node'))
    // console.log(nodeAbi.getAbi('30.0.1', 'electron'))

    // for (const arrowKey of Object.values(arrowKeys)) {
    //     console.log(arrowKey);
    //     globalShortcut.register(arrowKey, () => pressedUpKey(arrowKey));
    // }
    globalShortcut.register('q', () => witnessManager.getNextPuzzle());
});

// ioHook.on('keydown', (event) => {
//     console.log(event); // { type: 'mousemove', x: 700, y: 400 }
// });

app.on('window-all-closed', () => {
    console.log('all windows closed');
});
