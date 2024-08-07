const chestColor = Object.freeze({
    RED: 'RED',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
});

const chestState = Object.freeze({
    CLOSED: 'CLOSED',
    OPEN: 'OPEN',
});


// Bounding Box - Static Definitions
const centerX = 16;
const centerY = 20;
const bbWidth = 18;
const bbHeight = 16;
const activationDistance = 2;

// Bounding Box - Calculated
const bbLeftX = centerX - bbWidth / 2;
const bbRightX = centerX + bbWidth / 2;
const bbTopY = centerY - bbHeight / 2;
const bbBottomY = centerY + bbHeight / 2;
class Chest {
    constructor(engine, startingX, startingY, color) {
        this.engine = engine;
        
        // Animation Constants
        this.spr = new Image();
        this.spr.src = './chest-an.png';
        this.sprWidth = 32;
        this.sprHeight = 32;
        this.sprHeightCutline = 16;

        // Animation and Movement
        this.currentAnimationFrame = 0;
        this.currentAnimationWaitFrame = 0;
        this.engineFramesPerAnimationFrame = 3;
        this.currentAnimationMaxFrames;

        // State
        this.state = chestState.CLOSED;
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
        return this.y + bbTopY;
    }
    getBoundingBottom() {
        return this.y + bbBottomY;
    }

    update() {
        // for (const objectSolid of this.engine.getObjectSolidList()) {
        //     if (checkBoundingBoxesCollision(this, objectSolid, 0, this.maxSpeed)) {
        //         isCollided = true;
        //         moveToBoundingBoxCollisionTop(this, objectSolid);
        //     }
        // }
    }

    draw(ctx) {
        // Check fox sprite for state update
        // this.checkForSpriteStateUpdate();

        // Draw sprite
        // ctx.drawImage(this.spr,
        //     this.currentAnimationFrame * this.sprWidth, 
        //     0, 
        //     this.sprWidth, 
        //     this.sprHeight, 
        //     this.x - this.engine.winX, 
        //     this.y - this.engine.winY, 
        //     this.sprWidth, 
        //     this.sprHeight);

        // Top half of sprite
        this.engine.submitImageForDraw(20,
            this.spr, 
            this.currentAnimationFrame * this.sprWidth, 
            0, 
            this.sprWidth, 
            this.sprHeightCutline, 
            this.x - this.engine.winX, 
            this.y - this.engine.winY, 
            this.sprWidth, 
            this.sprHeightCutline);

        // Top half of sprite
        this.engine.submitImageForDraw(5,
            this.spr, 
            this.currentAnimationFrame * this.sprWidth, 
            this.sprHeightCutline, 
            this.sprWidth, 
            this.sprHeight - this.sprHeightCutline, 
            this.x - this.engine.winX, 
            this.y + this.sprHeightCutline - this.engine.winY, 
            this.sprWidth, 
            this.sprHeight - this.sprHeightCutline);

        // Draw Hitboxes
        if (this.engine.drawHitboxes) {
            // Draw collision hitbox
            this.engine.submitBoundingBoxForDraw(99, "red",
                this.x + bbLeftX - this.engine.winX, 
                this.y + bbTopY - this.engine.winY, 
                bbWidth, 
                bbHeight);

            // Draw activation hitbox
            this.engine.submitBoundingBoxForDraw(99, "blue",
                this.x + bbLeftX - activationDistance - this.engine.winX, 
                this.y + bbTopY - activationDistance - this.engine.winY, 
                bbWidth + 2* activationDistance, 
                bbHeight + 2* activationDistance);
        }
        
        // Setup properties for next rendered frame
        // this.setupNextAnimationFrame();    
    }
}

module.exports = {
    chestColor, Chest
}