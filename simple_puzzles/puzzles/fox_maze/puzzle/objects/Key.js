const { checkBoundingBoxesCollision } = require('../helpers/collision');
const { COLOR } = require('../helpers/color');
const { inventoryWidth } = require('../Engine');

const state = Object.freeze({
    UNCOLLECTED: 'UNCOLLECTED',
    COLLECTED: 'COLLECTED',
});

// Audio
const audio = new Audio('sounds/collect.mp3');

// Bounding Box - Player - Static Definitions
let boundingData = {
    [state.UNCOLLECTED]: {
        centerX: 16,
        centerY: 28,
        bbWidth: 10,
        bbHeight: 10
    },
    [state.COLLECTED]: {
        centerX: 16,
        centerY: 16,
        bbWidth: 10,
        bbHeight: 20
    }
}
boundingData = Object.fromEntries(
    Object.entries(boundingData).map(([state, data]) => {
        const { centerX, centerY, bbWidth, bbHeight } = data;
        return [state, {
            ...data,
            bbLeftX: centerX - bbWidth / 2,
            bbRightX: centerX + bbWidth / 2,
            bbTopY: centerY - bbHeight / 2,
            bbBottomY: centerY + bbHeight / 2
        }];
    })
);

class Key {
    constructor(engine, startingX, startingY, color, slotIndex) {
        this.engine = engine;
        this.inventoryOffsetX = (slotIndex + 0.5) * inventoryWidth - boundingData[state.COLLECTED].centerX;
        
        // Animation Constants
        this.spr = new Image();
        switch(color) {
            case COLOR.RED:
                this.spr.src = 'graphics/sprites/key_red.png';
                break;
            case COLOR.BLUE:
                this.spr.src = 'graphics/sprites/key_blue.png';
                break;
            case COLOR.GREEN:
                this.spr.src = 'graphics/sprites/key_green.png';
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
        this.state = state.UNCOLLECTED;
        this.lastState;
        this.x = startingX;
        this.y = startingY;
    }

    // Bounding Box
    getBoundingLeft() {
        return this.x + boundingData[this.state].bbLeftX;
    }
    getBoundingRight() {
        return this.x + boundingData[this.state].bbRightX;
    }
    getBoundingTop() {
        return this.y + boundingData[this.state].bbTopY;
    }
    getBoundingBottom() {
        return this.y + boundingData[this.state].bbBottomY;
    }

    update() {
        if (!this.isCollected()) {
            if (checkBoundingBoxesCollision(this, this.engine.getPlayerObject())) {
                audio.currentTime = 0;
                audio.play();
                this.updateState(state.COLLECTED);
                this.x = this.engine.winX + this.inventoryOffsetX;
                this.y = this.engine.winY + 4;
            }
        } else {
            this.x = this.engine.winX + this.inventoryOffsetX;
            this.y = this.engine.winY + 4;
        }
    }

    draw() {
        // Check sprite for state update
        this.checkForSpriteStateUpdate();

        // Draw Sprite
        this.engine.submitImageForDraw(this.isCollected() ? 70 : 20,
            this.spr, 
            this.currentAnimationFrame * this.sprWidth, 
            this.currentAnimationSpritesheetRow * this.sprHeight, 
            this.sprWidth,
            this.sprHeight,
            this.x - this.engine.winX,
            this.y - this.engine.winY,
            this.sprWidth, 
            this.sprHeight);

        // Draw Hitboxes
        if (this.engine.drawHitboxes) {
            // Draw collision hitbox
            this.engine.submitBoundingBoxForDraw(99, "red",
                this.x + boundingData[this.state].bbLeftX - this.engine.winX, 
                this.y + boundingData[this.state].bbTopY - this.engine.winY, 
                boundingData[this.state].bbWidth, 
                boundingData[this.state].bbHeight);
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
                case state.UNCOLLECTED:
                    this.currentAnimationMaxFrames = 4;
                    this.currentAnimationSpritesheetRow = 0;
                    this.currentAnimationFrame = 0;
                    break;
                case state.COLLECTED:
                    this.currentAnimationMaxFrames = 1;
                    this.currentAnimationSpritesheetRow = 1;
                    this.currentAnimationFrame = 0;
                    break;
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
            if (this.currentAnimationFrame == this.currentAnimationMaxFrames - 1) {
                this.currentAnimationFrame = 0;
                return;
            }

            // Progress to next frame of current animation
            this.currentAnimationFrame++;
        }
    }

    isCollected() {
        return this.state === state.COLLECTED;
    }

    consume() {
        this.engine.removeObject(this);
    }

    updateState(newState) {
        if (newState !== this.state) {
            this.state = newState;
        }
    }
}

module.exports = { Key }