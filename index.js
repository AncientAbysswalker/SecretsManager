const { app, BrowserWindow, globalShortcut } = require('electron')
const nodeAbi = require('node-abi')

const ipc = require('electron').ipcMain;

const pathTimeout = 5 * 1000

const puzzlesList = [
    {
        name: "TOO EASY LOL",
        hash: "NEEV6DHM",
        size: 384
    },
    {
        name: "Hidden Path",
        hash: "XLUMVWBS",
        size: 466
    },
    {
        name: "Got it all?",
        hash: "T6NB5ZNN",
        size: 712
    },
];

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
            this.createWitnessWindow(this.currentPuzzle)
        } else if (this.currentPuzzleWindow == null) {
            this.createWitnessWindow(this.currentPuzzle)
        }       
    }

    getNextPuzzle() {
        this.currentPuzzle = this.unsolvedPuzzleList.shift();
        this.createWitnessWindow(this.currentPuzzle)   
    }

    createWitnessWindow(puzzleDefinition) {
        const win = new BrowserWindow({
            width: puzzleDefinition["size"],
            height: puzzleDefinition["size"] + 20,
            zoomFactor: 0.5,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        })
        // win.webContents.openDevTools();
        win.removeMenu()

        console.log(puzzleDefinition)
        win.loadFile(`witness/play/${puzzleDefinition["hash"]}.html`)

        // Handler for puzzle solve
        ipc.on(`solved_event::${puzzleDefinition["name"]}`, (event, message) => {
            console.log(message)
            console.log(puzzleDefinition["name"])
            ipc.removeAllListeners(`solved_event::${puzzleDefinition["name"]}`)
            this.getNextPuzzle(true);
        })
        // win.webContents.on("solved_event", function(arg1, arg2){
            
        //     console.log(arg1, arg2); // this will print inside parent_window devtools console
        // });
        // win.loadFile('witness/play/T6NB5ZNN.html')

        this.currentPuzzleWindow = win;

        win.on('close', () => {
            ipc.removeAllListeners(`solved_event::${puzzleDefinition["name"]}`)
            if (this.currentPuzzleWindow === win) {
                this.currentPuzzleWindow = null;
            }
        });
    }
}

const witnessManager = new WitnessManager();

app.whenReady().then(() => {
    // console.log(nodeAbi.getAbi('15.14.0', 'node'))
    // console.log(nodeAbi.getAbi('30.0.1', 'electron'))

    for (const arrowKey of Object.values(arrowKeys)) {
        console.log(arrowKey)
        globalShortcut.register(arrowKey, () => pressedUpKey(arrowKey))
    }    

    globalShortcut.register("q", () => witnessManager.getNextPuzzle())

    // while (true) {
    //     console.log(9)
    // }

    
});

// ioHook.on('keydown', (event) => {
//     console.log(event); // { type: 'mousemove', x: 700, y: 400 }
// });

app.on('window-all-closed', () => {
    console.log("all windows closed")
});

function pressedUpKey(arrowKey) {
    console.log(`${arrowKey} is pressed`)
    console.log(new Date().getTime())

    witnessManager.initiatePuzzles();
    // puzzles = shuffle(puzzlesList)
    // let max = 2
    // createWitnessWindow(puzzlesList[Math.floor(Math.random() * max)])
};

const arrowKeys = Object.freeze({
    UP: "Up",
    DOWN: "Down",
    LEFT: "Left",
    RIGHT: "Right"
});