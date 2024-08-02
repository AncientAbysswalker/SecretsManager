const { ipcRenderer } = require('electron');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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
    constructor() {
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
        this.maxSpeed = 2;

        // Fox State
        this.state = foxState.STANDING; // Standing
        this.lastState;
        this.x = 100;
        this.y = 300;
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

    checkForSolid(x, y) {
        const xx = Math.floor(x / 32);
        const yy = Math.floor(y / 32);
        return (xx==10 && yy==10) || (xx==9 && yy==9); // Check array
    }

    // Check Movement
    checkMoveLeft() {
        const x = this.getBoundingLeft();
        const y1 = this.getBoundingTop();
        const y2 = this.getBoundingBottom();

        // Check for collision; otherwise move unrestricted
        if (this.checkForSolid(x - this.maxSpeed, y1) || this.checkForSolid(x - this.maxSpeed, y2)) {
            this.x = Math.floor(x / 32) * 32 + bbw/2 - centerX + 1;
        } else {
            this.x -= this.maxSpeed;
        }
    }
    checkMoveRight() {
        const x = this.getBoundingRight();
        const y1 = this.getBoundingTop();
        const y2 = this.getBoundingBottom();

        // Check for collision; otherwise move unrestricted
        if (this.checkForSolid(x + this.maxSpeed, y1) || this.checkForSolid(x + this.maxSpeed, y2)) {
            this.x = Math.floor((x + this.maxSpeed) / 32) * 32 - bbw/2 - centerX - 1;
        } else {
            this.x += this.maxSpeed;
        }
    }
    checkMoveUp() {
        const y = this.getBoundingTop();
        const x1 = this.getBoundingLeft();
        const x2 = this.getBoundingRight();

        // Check for collision; otherwise move unrestricted
        if (this.checkForSolid(x1, y - this.maxSpeed) || this.checkForSolid(x2, y - this.maxSpeed)) {
            this.y = Math.floor(y / 32) * 32 + bbh/2 - centerY + 1;
        } else {
            this.y -= this.maxSpeed;
        }
    }
    checkMoveDown() {
        const y = this.getBoundingBottom();
        const x1 = this.getBoundingLeft();
        const x2 = this.getBoundingRight();

        // Check for collision; otherwise move unrestricted
        if (this.checkForSolid(x1, y + this.maxSpeed) || this.checkForSolid(x2, y + this.maxSpeed)) {
            this.y = Math.floor((y + this.maxSpeed) / 32) * 32 - bbh/2 - centerY - 1;
        } else {
            this.y += this.maxSpeed;
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
        // Check fox sprite for state update
        this.checkForSpriteStateUpdate();

        // Draw fox
        ctx.drawImage(this.faceRight ? this.sprFoxR : this.sprFoxL, 
            this.currentAnimationFrame * this.frameWidth, 
            this.currentAnimationSpritesheetRow*this.frameHeight, 
            this.frameWidth, 
            this.frameHeight, 
            this.x - winX, 
            this.y - winY, 
            this.frameWidth, 
            this.frameHeight);

        // Draw hitbox
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x + centerX - bbw/2 - winX, 
            this.y + centerY - bbh/2 - winY, 
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

let winX = 0;
let winY = 0;

// Map
let map = new Image();
// map.src = './6FsdxmA.jpg';
map.src = './testnew.png';

// Keyboard event handlers for movement
let keyPressed = {};
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

let fox = new Fox();

let lastEngineFrame = -1;
tick(0);

function tick(timestamp) {
    const currentEngineFrame = Math.floor(timestamp / 1000 * 30);

    // Only run update once per frame
    if (currentEngineFrame > lastEngineFrame) {
        lastEngineFrame = currentEngineFrame;

        fox.checkAndUpdateMovement();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        ctx.drawImage(map, 300-winX, 300-winY);
        
        fox.draw(ctx);
    
        ctx.beginPath();
        ctx.rect(320 - winX, 320 - winY, 32, 32);
        ctx.fillStyle = '#ff95dd';
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.rect(32*9 - winX, 32*9 - winY, 32, 32);
        ctx.fillStyle = '#ff95dd';
        ctx.fill();
        ctx.closePath();
    
        // Loop update with a timeout
        
    }

    requestAnimationFrame(tick);
}

// Listen for the window-moved event from the main process
ipcRenderer.on('window-moved', (event, bounds) => {
    winX = bounds.x;
    winY = bounds.y;
});
