const { keys } = require('object-hash');
const { checkBoundingBoxesCollision } = require('./helpers/collision');

const keyColor = Object.freeze({
    RED: 'RED',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
});

const keyState = Object.freeze({
    UNCOLLECTED: 'UNCOLLECTED',
    COLLECTED: 'COLLECTED',
});

// Audio
const audio = new Audio('collect.mp3');

// Sprite
const offsetY = -12;

// Bounding Box - Static Definitions
const centerX = 16;
const centerY = 28;
const bbWidth = 10;
const bbHeight = 10;

// Bounding Box - Calculated
const bbLeftX = centerX - bbWidth / 2;
const bbRightX = centerX + bbWidth / 2;
const bbTopY = centerY - bbHeight / 2;
const bbBottomY = centerY + bbHeight / 2;
class Key {
    constructor(engine, startingX, startingY, color) {
        this.engine = engine;
        
        // Animation Constants
        this.spr = new Image();
        switch(color) {
            case keyColor.RED:
                this.spr.src = './key_red.png';
                break;
            case keyColor.BLUE:
                this.spr.src = './key_blue.png';
                break;
            case keyColor.GREEN:
                this.spr.src = './key_green.png';
                break;
            default:
                throw new Error(`Invalid color provided: ${color}`);
        }
        this.sprWidth = 32;
        this.sprHeight = 32;

        // Animation and Movement
        this.currentAnimationFrame = 0;
        this.currentAnimationWaitFrame = 0;
        this.engineFramesPerAnimationFrame = 6;
        this.currentAnimationMaxFrames;

        // State
        this.state = keyState.UNCOLLECTED;
        this.lastState;
        this.x = startingX;
        this.y = startingY;
    }

    // Bounding Box
    getBoundingLeft() {
        return this.x + bbLeftX;
    }
    getBoundingRight() {
        return this.x + bbRightX;
    }
    getBoundingTop() {
        return this.y + bbTopY + offsetY;
    }
    getBoundingBottom() {
        return this.y + bbBottomY + offsetY;
    }

    update() {
        if (!this.isCollected() && checkBoundingBoxesCollision(this, this.engine.getPlayerObject())) {
            console.log("collected");
            audio.currentTime = 0;
            audio.play();
            this.updateState(keyState.COLLECTED);
        }
    }

    draw(ctx) {
        // Check sprite for state update
        this.checkForSpriteStateUpdate();

        // Draw Sprite
        this.engine.submitImageForDraw(70,
            this.spr, 
            this.currentAnimationFrame * this.sprWidth, 
            this.currentAnimationSpritesheetRow, 
            this.sprWidth, 
            this.sprHeight, 
            this.isCollected() ? 50 : (this.x - this.engine.winX), 
            this.isCollected() ? 50 : (this.y - this.engine.winY + offsetY), 
            this.sprWidth, 
            this.sprHeight);

        // Draw Hitboxes
        if (this.engine.drawHitboxes) {
            // Draw collision hitbox
            this.engine.submitBoundingBoxForDraw(99, "red",
                this.x + bbLeftX - this.engine.winX, 
                this.y + bbTopY - this.engine.winY + offsetY, 
                bbWidth, 
                bbHeight);
        }
        
        // Setup properties for next rendered frame
        this.setupNextAnimationFrame();    
    }

    checkForSpriteStateUpdate() {
        // If state changed, cut to new animation
        if (this.lastState != this.state) {
            this.lastState = this.state;

            switch(this.state)
            {
                case keyState.UNCOLLECTED:
                    this.currentAnimationMaxFrames = 4 - 1;
                    this.currentAnimationSpritesheetRow = 0;
                    this.currentAnimationFrame = 0;
                    break;
                case keyState.COLLECTED:
                    this.currentAnimationMaxFrames = 1 - 1;
                    this.currentAnimationSpritesheetRow = 1;
                    this.currentAnimationFrame = 0;
                    break;
                default:
            } 
        }
    }

    setupNextAnimationFrame() {
        // Continue to wait is there remain wait frames
        if (this.currentAnimationWaitFrame != this.engineFramesPerAnimationFrame) {
            this.currentAnimationWaitFrame++;
            
        // Else move to setup next frame and reset current wait frame to 0
        } else {
            this.currentAnimationWaitFrame = 0;
            
            // Loop at end of animation
            if (this.currentAnimationFrame == this.currentAnimationMaxFrames) {
                this.currentAnimationFrame = 0;
                return;
            }

            // Progress to next frame of current animation
            this.currentAnimationFrame++;
        }
    }

    isCollected() {
        return this.state === keyState.COLLECTED;
    }

    updateState(newState) {
        if (newState !== this.state) {
            this.state = newState;
        }
    }
}

module.exports = {
    keyColor, Key
}