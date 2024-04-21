const { app, BrowserWindow, globalShortcut } = require('electron')
const nodeAbi = require('node-abi')

const ipc = require('electron').ipcMain;

const pathTimeout = 5 * 1000

const createWitnessWindow = () => {
    const win = new BrowserWindow({
        width: 750,
        height: 750,
        zoomFactor: 0.5,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.webContents.openDevTools();
    win.removeMenu()

    win.loadFile('witness/play/XLUMVWBS.html')

    win.webContents.on("solved_event", function(arg1, arg2){
        console.log(345673842);
        console.log(arg1, arg2); // this will print inside parent_window devtools console
    });
    // win.loadFile('witness/play/T6NB5ZNN.html')
}

app.whenReady().then(() => {
    // console.log(nodeAbi.getAbi('15.14.0', 'node'))
    // console.log(nodeAbi.getAbi('30.0.1', 'electron'))

    for (const arrowKey of Object.values(arrowKeys)) {
        console.log(arrowKey)
        globalShortcut.register(arrowKey, () => pressedUpKey(arrowKey))
    }    

    // while (true) {
    //     console.log(9)
    // }

    ipc.on('reply', (event, message) => {
        console.log(message); // logs out "Hello second window!"
    })
})

// ioHook.on('keydown', (event) => {
//     console.log(event); // { type: 'mousemove', x: 700, y: 400 }
// });

app.on('window-all-closed', () => {
    console.log("all windows closed")
})

function pressedUpKey(arrowKey) {
    console.log(`${arrowKey} is pressed`)
    console.log(new Date().getTime())
    createWitnessWindow()
}

const arrowKeys = Object.freeze({
    UP: "Up",
    DOWN: "Down",
    LEFT: "Left",
    RIGHT: "Right"
});