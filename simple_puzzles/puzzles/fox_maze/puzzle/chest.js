const chestColor = Object.freeze({
    RED: 'RED',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
});

const chestState = Object.freeze({
    CLOSED: 'CLOSED',
    OPEN: 'OPEN',
});

//TEMP
const winX = 0;
const winY=0;

const centerX = 16;
const centerY = 20;
const bbw = 18;
const bbh = 16;
class Chest {
    constructor(color) {
        this.spr = new Image();
        this.spr.src = './chest-an.png';
        this.sprWidth = 32;
        this.sprHeight = 32;

        // Animation and Movement
        this.currentAnimationFrame = 0;
        this.currentAnimationWaitFrame = 0;
        this.engineFramesPerAnimationFrame = 3;
        this.currentAnimationMaxFrames;

        // State
        this.state = chestState.CLOSED; // Standing
        this.lastState;
        this.x = 100;
        this.y = 332;
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

    draw(ctx) {
        // Check fox sprite for state update
        // this.checkForSpriteStateUpdate();

        // Draw fox
        ctx.drawImage(this.spr,
            this.currentAnimationFrame * this.sprWidth, 
            0, 
            this.sprWidth, 
            this.sprHeight, 
            this.x - winX, 
            this.y - winY, 
            this.sprWidth, 
            this.sprHeight);

        // Draw solid hitbox
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.x + centerX - bbw/2 - winX, 
            this.y + centerY - bbh/2 - winY, 
            bbw, 
            bbh);
        ctx.closePath()

        // Draw activation hitbox
        // ctx.beginPath();
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + centerX - bbw/2 - winX, 
        //     this.y + centerY - bbh/2 - winY, 
        //     bbw, 
        //     bbh);
        // ctx.closePath()
        
        // Setup properties for next rendered frame
        // this.setupNextAnimationFrame();    
    }
}

module.exports = {
    chestColor, Chest
}