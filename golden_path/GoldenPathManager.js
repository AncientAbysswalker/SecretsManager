const { GlobalKeyboardListener } = require('node-global-key-listener');
const gkl = new GlobalKeyboardListener();
var hash = require('object-hash');

const { app, BrowserWindow } = require('electron');

const goldenPaths = require('./validGoldenPaths');
const { arrowKeys } = require('./arrowKeys');

const logHashes = true;

module.exports = class GoldenPathManager {
    static pathTimeout = 5 * 1000;

    constructor(witnessManager, simplePuzzleManager) {
        this.currentTime = 0;
        this.currentIndex = 0;
        this.remainingPaths = [];
        this.witnessManager = witnessManager;
        this.simplePuzzleManager = simplePuzzleManager;

        if (logHashes) {
            for (const goldenPath of goldenPaths) {
                const pathhash = hash(goldenPath['path']);
                console.log(pathhash);
            }
        }

        const gpm = this;
        gkl.addListener(function (e, down) {
            if (
                e.state == 'DOWN' &&
                Object.values(arrowKeys).includes(e.name)
            ) {
                gpm.pressedArrowKey(e.name);
            }
        });
    }

    pressedArrowKey(arrowKey) {
        // Check if we've waited too long for the next input. If so, set our pointer to the start and re-initiate the available list of valid golden paths
        const now = Date.now();
        if (now - this.currentTime > GoldenPathManager.pathTimeout) {
            this.currentIndex = 0;
            this.remainingPaths = goldenPaths.slice(0);
        }

        // Regardless, set time to now
        this.currentTime = now;

        // Check available list of valid golden paths from end to start
        for (let i = this.remainingPaths.length - 1; i >= 0; i--) {
            let possiblePath = this.remainingPaths[i];

            // If the pressed arrow key does not match, then remove the possibility from the list
            if (possiblePath['path'][this.currentIndex] != arrowKey) {
                this.remainingPaths.splice(i, 1);

                // If the pressed arrow key does match and it is the final entry in the possibility, run the associated action
            } else if (possiblePath['path'].length == this.currentIndex + 1) {
                possiblePath['action'](this);
            }
        }

        this.currentIndex += 1;
    }
};
