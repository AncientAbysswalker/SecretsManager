const { 
    checkMovingBoundingBoxesCollision, 
    moveToBoundingBoxCollisionBottom,
    moveToBoundingBoxCollisionTop,
    moveToBoundingBoxCollisionRight,
    moveToBoundingBoxCollisionLeft
} = require('./helpers/collision');

const foxState = Object.freeze({
    INITIAL_SLEEPING: 'INITIAL_SLEEPING',
    WALKING: 'WALKING',
    STANDING: 'STANDING',
});

const centerX = 16;
const centerY = 24;
const bbw = 20;
const bbh = 16;
class Fox {
    constructor(engine, startingX, startingY) {
        this.engine = engine;

        // Animation Constants
        this.sprFoxL = new Image();
        this.sprFoxR = new Image();
        this.sprFoxL.src = './fox_l.png';
        this.sprFoxR.src = './fox_r.png';
        this.frameWidth = 32;
        this.frameHeight = 32;

        // Animation and Movement
        this.specialAnimationChance = 0.1;
        this.currentAnimationFrame = 0;
        this.currentAnimationWaitFrame = 0;
        this.engineFramesPerAnimationFrame = 3;
        this.currentAnimationMaxFrames;
        this.currentAnimationSpritesheetRow;
        this.maxSpeed = 7;

        // Fox State
        this.state = foxState.STANDING; // Standing
        this.lastState;
        this.x = startingX;
        this.y = startingY;
        this.faceRight = true;
    }

    updateAndDraw(ctx) {
        this.checkAndUpdateMovement();
        this.draw(ctx);
    }

    // Bounding Box
    getBoundingLeft() {
        return this.x + centerX - bbw/2;
    }
    getBoundingRight() {
        return this.x + centerX + bbw/2;
    }
    getBoundingTop() {
        return this.y + centerY - bbh/2;
    }
    getBoundingBottom() {
        return this.y + centerY + bbh/2;
    }

    checkForSolidMap(x, y) {
        const xx = Math.floor(x / 32);
        const yy = Math.floor(y / 32);
        // return (xx==10 && yy==10) || (xx==10 && yy==9)|| (xx==10 && yy==8); // Check array
        return this.engine.getMapCollision(yy, xx); // Check map data
    }

    // Check Movement
    checkMoveLeft() {
        const x = this.getBoundingLeft();
        const y1 = this.getBoundingTop();
        const y2 = this.getBoundingBottom();

        // Check for map collision, then object solids, then otherwise move unrestricted
        if (this.checkForSolidMap(x - this.maxSpeed, y1) || this.checkForSolidMap(x - this.maxSpeed, y2)) {
            this.x = Math.floor(x / 32) * 32 + bbw/2 - centerX + 1;
        } else {
            let isCollided = false;
            for (const objectSolid of this.engine.getObjectSolidList()) {
                if (checkMovingBoundingBoxesCollision(this, objectSolid, - this.maxSpeed, 0)) {
                    isCollided = true;
                    moveToBoundingBoxCollisionRight(this, objectSolid);
                }
            }

            if (!isCollided) {
                this.x -= this.maxSpeed;
            }
        }
    }
    checkMoveRight() {
        const x = this.getBoundingRight();
        const y1 = this.getBoundingTop();
        const y2 = this.getBoundingBottom();

        // Check for map collision, then object solids, then otherwise move unrestricted
        if (this.checkForSolidMap(x + this.maxSpeed, y1) || this.checkForSolidMap(x + this.maxSpeed, y2)) {
            this.x = Math.floor((x + this.maxSpeed) / 32) * 32 - bbw/2 - centerX - 1;
        } else {
            let isCollided = false;
            for (const objectSolid of this.engine.getObjectSolidList()) {
                if (checkMovingBoundingBoxesCollision(this, objectSolid, this.maxSpeed, 0)) {
                    isCollided = true;
                    moveToBoundingBoxCollisionLeft(this, objectSolid);
                }
            }

            if (!isCollided) {
                this.x += this.maxSpeed;
            }
        }
    }
    checkMoveUp() {
        const y = this.getBoundingTop();
        const x1 = this.getBoundingLeft();
        const x2 = this.getBoundingRight();

        // Check for map collision, then object solids, then otherwise move unrestricted
        if (this.checkForSolidMap(x1, y - this.maxSpeed) || this.checkForSolidMap(x2, y - this.maxSpeed)) {
            this.y = Math.floor(y / 32) * 32 + bbh/2 - centerY + 1;
        } else {
            let isCollided = false;
            for (const objectSolid of this.engine.getObjectSolidList()) {
                if (checkMovingBoundingBoxesCollision(this, objectSolid, 0, - this.maxSpeed)) {
                    isCollided = true;
                    moveToBoundingBoxCollisionBottom(this, objectSolid);
                }
            }

            if (!isCollided) {
                this.y -= this.maxSpeed;
            }
        }
    }
    checkMoveDown() {
        const y = this.getBoundingBottom();
        const x1 = this.getBoundingLeft();
        const x2 = this.getBoundingRight();

        // Check for map collision, then object solids, then otherwise move unrestricted
        if (this.checkForSolidMap(x1, y + this.maxSpeed) || this.checkForSolidMap(x2, y + this.maxSpeed)) {
            this.y = Math.floor((y + this.maxSpeed) / 32) * 32 - bbh/2 - centerY - 1;
        } else {
            let isCollided = false;
            for (const objectSolid of this.engine.getObjectSolidList()) {
                if (checkMovingBoundingBoxesCollision(this, objectSolid, 0, this.maxSpeed)) {
                    isCollided = true;
                    moveToBoundingBoxCollisionTop(this, objectSolid);
                }
            }

            if (!isCollided) {
                this.y += this.maxSpeed;
            }
        }
    }

    checkForSpriteStateUpdate() {
        // If state changed, cut to new animation
        if (this.lastState != this.state) {
            this.lastState = this.state;

            switch(this.state)
            {
                case foxState.STANDING:
                    this.currentAnimationMaxFrames = 5 - 1;
                    this.currentAnimationSpritesheetRow = 0;
                    this.currentAnimationFrame = 0;
                    break;
                case foxState.WALKING:
                    this.currentAnimationMaxFrames = 8 - 1;
                    this.currentAnimationSpritesheetRow = 2;
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

            // Update chance for special animation
            if (this.specialAnimationChance < 0.1) {
                this.specialAnimationChance += 0.0001; // Appx 30sec to refill
            }

            // Special handling for end of animation
            if (this.currentAnimationFrame == this.currentAnimationMaxFrames) {
                // Special alternate resting animation
                if (this.state == foxState.STANDING) {
                    // Potentially start special animation, else end it
                    if (this.currentAnimationSpritesheetRow == 0 && Math.random() < this.specialAnimationChance) {
                        this.specialAnimationChance = 0;
                        this.currentAnimationMaxFrames = 14 - 1;
                        this.currentAnimationSpritesheetRow = 1;
                    } else {
                        this.currentAnimationMaxFrames = 5 - 1;
                        this.currentAnimationSpritesheetRow = 0;
                    }
                }
                this.currentAnimationFrame = 0;

                return;
            }
            
            // Progress to next frame of current animation
            this.currentAnimationFrame++;
        }
    }

    draw(ctx) {
        console.log(this.engine.winX, this.engine.winY)
        // Check fox sprite for state update
        this.checkForSpriteStateUpdate();

        // Draw fox
        ctx.drawImage(this.faceRight ? this.sprFoxR : this.sprFoxL, 
            this.currentAnimationFrame * this.frameWidth, 
            this.currentAnimationSpritesheetRow*this.frameHeight, 
            this.frameWidth, 
            this.frameHeight, 
            this.x - this.engine.winX, 
            this.y - this.engine.winY, 
            this.frameWidth, 
            this.frameHeight);

        // Draw hitbox
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x + centerX - bbw/2 - this.engine.winX, 
            this.y + centerY - bbh/2 - this.engine.winY, 
            bbw, 
            bbh);
        ctx.closePath()
        
        // Setup properties for next rendered frame
        this.setupNextAnimationFrame();    
    }

    checkAndUpdateMovement() {
        if (keyPressed["left"] || keyPressed["right"] || keyPressed["up"] || keyPressed["down"]) {
            if (keyPressed["left"] != keyPressed["right"]) {
                // Left
                if (keyPressed["left"]) {
                    this.faceRight = false;
                    this.updateState(foxState.WALKING);
                    this.checkMoveLeft();
                }
                // Right
                if (keyPressed["right"]) {
                    this.faceRight = true;
                    this.updateState(foxState.WALKING);
                    this.checkMoveRight();
                }
            }
            if (keyPressed["up"] != keyPressed["down"]) {
                // Up
                if (keyPressed["up"]) {
                    this.updateState(foxState.WALKING);
                    this.checkMoveUp();
                }
                // Down
                if (keyPressed["down"]) {
                    this.updateState(foxState.WALKING);
                    this.checkMoveDown();
                }
            }
        } else {
            if (this.state === foxState.WALKING) {
                this.updateState(foxState.STANDING);
            }
        }
    }

    updateState(newState) {
        if (newState !== this.state) {
            this.state = newState;
        }
    }
}

// Keyboard event handlers for movement
var keyPressed = {};
window.addEventListener("keydown", (e) => {
    // All the extra repeated-logic is to reduce input lag
    if (e.repeat) { return }

    if (!keyPressed["up"] && (e.key === "W" || e.key === "w")) {
        keyPressed["up"] = true;
    }
    if (!keyPressed["down"] && (e.key === "S" || e.key === "s")) {
        keyPressed["down"] = true;
    }
    if (!keyPressed["left"] && (e.key === "A" || e.key === "a")) {
        keyPressed["left"] = true;
    }
    if (!keyPressed["right"] && (e.key === "D" || e.key === "d")) {
        keyPressed["right"] = true;
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "W" || e.key === "w") {
        keyPressed["up"] = false;
    }
    if (e.key === "S" || e.key === "s") {
        keyPressed["down"] = false;
    }
    if (e.key === "A" || e.key === "a") {
        keyPressed["left"] = false;
    }
    if (e.key === "D" || e.key === "d") {
        keyPressed["right"] = false;
    }
});

module.exports = {
    foxState, Fox
}