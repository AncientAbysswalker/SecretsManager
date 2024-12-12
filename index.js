const { app } = require('electron');

const WitnessManager = require('./witness/WitnessManager');
const SimplePuzzleManager = require('./simple_puzzles/SimplePuzzleManager');
const GoldenPathManager = require('./golden_path/GoldenPathManager');

const witnessManager = new WitnessManager();
const simplePuzzleManager = new SimplePuzzleManager();
const goldenPathManager = new GoldenPathManager(
    witnessManager,
    simplePuzzleManager
);

app.on('window-all-closed', () => {
    console.log('all windows closed');
});
