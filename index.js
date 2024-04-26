const { app, BrowserWindow, globalShortcut } = require('electron');

const WitnessManager = require('./witness/WitnessManager');
const GoldenPathManager = require('./golden_path/GoldenPathManager');

// LEGACY: For registering with globalShortcut
// const arrowKeys = Object.freeze({
//     UP: 'Up',
//     DOWN: 'Down',
//     LEFT: 'Left',
//     RIGHT: 'Right',
// });

const witnessManager = new WitnessManager();
const goldenPathManager = new GoldenPathManager(witnessManager);

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
