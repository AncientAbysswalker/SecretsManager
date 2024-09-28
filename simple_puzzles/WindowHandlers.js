function replaceSubstringAtIndex(original, index, replacement) {
    return (
        original.substring(0, index) +
        replacement +
        original.substring(index + replacement.length)
    );
}

// The time ranges CAN and WILL overlap. i.e. 5000 and 1000 means 1s show and 4s gap actually
const showLetterMillis = 1000;
const betweenLettersMillis = 5000;
const intervalsBetweenOccurrances = 12; // 1 min
class TitlePuzzleHandler {
    constructor(win, hiddenMessage) {
        this.index = -intervalsBetweenOccurrances;
        this.hiddenMessage = hiddenMessage;
        this.interval = this.startLoop();
        this.win = win;
    }

    startLoop() {
        return setInterval(() => {
            try {
                const originalTitle = this.win.getTitle();
                const replaceIndex = Math.floor(
                    Math.random() * originalTitle.length
                );

                // Wait for a number of intervals before starting the title changes
                // This is inside the try so if we try to get the window's title then we end the loop
                if (this.index < 0) {
                    this.index += 1;
                    return;
                }

                this.win.setTitle(
                    replaceSubstringAtIndex(
                        originalTitle,
                        replaceIndex,
                        this.hiddenMessage.charAt(this.index)
                    )
                );

                setTimeout(() => {
                    try {
                        this.win.setTitle(originalTitle);
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
                this.stopLoop();
            }
        }, betweenLettersMillis);
    }

    stopLoop() {
        clearInterval(this.interval);
    }
}

class IncrementalWindowResizeHandler {
    constructor(win, initialWidth, initialHeight, incrementWidth, incrementHeight) {
        this.initialHeight = initialHeight;
        this.incrementHeight = incrementHeight;
        this.initialWidth = initialWidth;
        this.incrementWidth = incrementWidth;
        this.resizeCount = 0;
        this.win = win;
    }

    increaseWindowSize() {
        this.resizeCount++;
        const newWidth = this.initialWidth + this.resizeCount * this.incrementWidth;
        const newHeight = this.initialHeight + this.resizeCount * this.incrementHeight;

        this.repeatWindowResize(newWidth, newHeight)
    }

    repeatWindowResize(width, height) {
        try {
            const bounds = this.win.getBounds();
    
            if (width <= bounds.width && height <= bounds.height) {
                return;
            }
    
            const newWidth = Math.min(width, bounds.width + 1);
            const newHeight = Math.min(height, bounds.height + 1);
    
            this.win.setSize(newWidth, newHeight);
        } catch {
            return;
        }
    
        setTimeout(() => {
            this.repeatWindowResize(width, height)
        }, 10); // 10ms delay (0.01 second)
    }
}

module.exports = {
    TitlePuzzleHandler,
    IncrementalWindowResizeHandler,
};
