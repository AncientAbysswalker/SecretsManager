// The time ranges CAN and WILL overlap. i.e. 5000 and 1000 means 1s show and 4s gap actually
const showLetterMillis = 1000;
const betweenLettersMillis = 5000;
const intervalsBetweenOccurrances = 4;

function replaceSubstringAtIndex(original, index, replacement) {
    return (
        original.substring(0, index) +
        replacement +
        original.substring(index + replacement.length)
    );
}

class TitlePuzzleHandler {
    constructor(hiddenMessage) {
        this.index = -intervalsBetweenOccurrances;
        this.hiddenMessage = hiddenMessage;
        this.interval = null;
        this.window;
    }

    affectedWindow(win) {
        this.window = win;

        if (this.interval !== null) {
            // Interval is already running, so do not create another
            return;
        }

        this.interval = setInterval(() => {
            try {
                const originalTitle = this.window.getTitle();
                const replaceIndex = Math.floor(
                    Math.random() * originalTitle.length
                );

                // Wait for a number of intervals before starting the title changes
                // This is inside the try so if we try to get the window's title then we end the loop
                if (this.index < 0) {
                    this.index += 1;
                    console.log(this.index);

                    return;
                }

                this.window.setTitle(
                    replaceSubstringAtIndex(
                        originalTitle,
                        replaceIndex,
                        this.hiddenMessage.charAt(this.index)
                    )
                );

                setTimeout(() => {
                    try {
                        this.window.setTitle(originalTitle);
                        if (this.index + 1 === this.hiddenMessage.length) {
                            this.index = -intervalsBetweenOccurrances;
                        } else {
                            this.index += 1;
                        }
                    } catch (err) {
                        this.stopLoop();
                    }
                }, showLetterMillis);
            } catch (err) {
                console.log(err);
                this.stopLoop();
            }
        }, betweenLettersMillis);
    }

    stopLoop() {
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
            this.index = 0;
        }
    }
}

module.exports = {
    TitlePuzzleHandler: TitlePuzzleHandler,
};
