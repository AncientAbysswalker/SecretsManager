const { GlobalKeyboardListener } = require('node-global-key-listener');
const gkl = new GlobalKeyboardListener();

const arrowKeys = Object.freeze({
    UP: 'UP ARROW',
    DOWN: 'DOWN ARROW',
    LEFT: 'LEFT ARROW',
    RIGHT: 'RIGHT ARROW',
});

const goldenPaths = [
    {
        path: [arrowKeys.UP, arrowKeys.UP, arrowKeys.UP, arrowKeys.DOWN],
        action: (gpm) => {
            gpm.witnessManager.initiatePuzzles();
        },
    },
];

module.exports = class GoldenPathManager {
    pathTimeout = 5 * 1000;

    constructor(witnessManager) {
        this.currentTime = 0;
        this.currentIndex = 0;
        this.remainingPaths = [];
        this.witnessManager = witnessManager;

        const gpm = this;
        gkl.addListener(function (e, down) {
            if (
                e.state == 'DOWN' &&
                Object.values(arrowKeys).includes(e.name)
            ) {
                console.log(e.name);
                console.log(9);
                gpm.pressedArrowKey(e.name);
            }
        });
    }

    pressedArrowKey(arrowKey) {
        // Check if we've waited too long for the next input. If so, set our pointer to the start and re-initiate the available list of valid golden paths
        const now = Date.now();
        if (now - this.currentTime > this.pathTimeout) {
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
