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

        this.currentAnimationImage = 0;
        this.currentWaitFrame = 0;
        this.framesPerImage = 3;
        this.maxSpeed = 2;

        // Fox State
        this.state = 1; // Standing
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

    draw(ctx) {
        let maxFrame;
        let row;
        switch(this.state)
        {
            case 1:
                maxFrame = 5 - 1;
                row = 0;
                break;
            case 0:
                maxFrame = 8 - 1;
                row = 2;
                break;
            case 2:
                maxFrame = 14 - 1;
                row = 1;
                break;
            default:
              // code block
          } 
        // this.state == 1 ? 5 -1 : 8-1;
        // const row = this.state == 1 ? 0 : 2;

        ctx.drawImage(this.faceRight ? this.sprFoxR : this.sprFoxL, 
            this.currentAnimationImage * this.frameWidth, 
            row*this.frameHeight, 
            this.frameWidth, 
            this.frameHeight, 
            this.x - winX, 
            this.y - winY, 
            this.frameWidth, 
            this.frameHeight);

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x + centerX - bbw/2 - winX, 
            this.y + centerY - bbh/2 - winY, 
            bbw, 
            bbh);
        ctx.closePath()
        
        // Next animation frame
        if (this.currentWaitFrame != this.framesPerImage) {
            this.currentWaitFrame++;
        } else {
            this.currentWaitFrame = 0;
            if (this.currentAnimationImage == maxFrame) {
                if (this.state == 2) {
                    this.updateState(1);
                }
                this.currentAnimationImage = 0;
            } else {
                this.currentAnimationImage++;
            }

        }
        
    }

    checkAndUpdateMovement() {
        if (keyPressed["left"] || keyPressed["right"] || keyPressed["up"] || keyPressed["down"]) {
            if (keyPressed["left"] != keyPressed["right"]) {
                // Left
                if (keyPressed["left"]) {
                    this.faceRight = false;
                    this.updateState(0);
                    this.checkMoveLeft();
                }
                // Right
                if (keyPressed["right"]) {
                    this.faceRight = true;
                    this.updateState(0);
                    this.checkMoveRight();
                }
            }
            if (keyPressed["up"] != keyPressed["down"]) {
                // Up
                if (keyPressed["up"]) {
                    this.updateState(0);
                    this.checkMoveUp();
                }
                // Down
                if (keyPressed["down"]) {
                    this.updateState(0);
                    this.checkMoveDown();
                }
            }
        } else {
            if (this.state === 0) {
                this.updateState(1);
            }
            if (this.state === 1 && this.currentAnimationImage == 0 && Math.random() < 0.005) {
                this.updateState(2);
            } 
        }
    }

    updateState(newState) {
        if (newState !== this.state) {
            this.state = newState;
            this.currentAnimationImage = 0;
        }
    }
}

let winX = 0;
let winY = 0;

// Map
let map = new Image();
map.src = './6FsdxmA.jpg';

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

let lastAnimationFrame = -1;
tick(0);

function tick(timestamp) {
    const currentAnimationFrame = Math.floor(timestamp / 1000 * 30);

    // Only run update once per frame
    if (currentAnimationFrame > lastAnimationFrame) {
        lastAnimationFrame = currentAnimationFrame;

        fox.checkAndUpdateMovement();
        // console.log(frame)
        // requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        ctx.drawImage(map, -winX, -winY);
        
        // console.log(fox.faceRight)
        fox.draw(ctx);
        // ctx.drawImage(fox.faceRight ? sprFoxR : sprFoxL, column*frameWidth, row*frameHeight, frameWidth, frameHeight, fox.x - winX, fox.y - winY, frameWidth, frameHeight);
        // console.log(timestamp / 1000)
    
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
    // });

//     if (column == 4) {
//         column = 0;
//     } else {
//         column++;
//     }
}

// Listen for the window-moved event from the main process
ipcRenderer.on('window-moved', (event, bounds) => {
    winX = bounds.x;
    winY = bounds.y;
});
