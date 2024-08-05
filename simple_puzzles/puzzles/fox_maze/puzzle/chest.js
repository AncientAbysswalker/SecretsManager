const chestColor = Object.freeze({
    RED: 'RED',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
});

const chestState = Object.freeze({
    CLOSED: 'CLOSED',
    OPEN: 'OPEN',
});

const centerX = 16;
const centerY = 20;
const bbw = 18;
const bbh = 16;
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
        this.state = chestState.CLOSED; // Standing
        this.lastState;
        this.x = startingX;
        this.y = startingY;
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

        // Draw hitbox
        this.engine.submitBoundingBoxForDraw(99, "red",
            this.x + centerX - bbw/2 - this.engine.winX, 
            this.y + centerY - bbh/2 - this.engine.winY, 
            bbw, 
            bbh);


        // ctx.beginPath();
        // ctx.strokeStyle = "red";
        // ctx.strokeRect(this.x + centerX - bbw/2 - this.engine.winX, 
        //     this.y + centerY - bbh/2 - this.engine.winY, 
        //     bbw, 
        //     bbh);
        // ctx.closePath()

        // Draw activation hitbox
        // ctx.beginPath();
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + centerX - bbw/2 - this.engine.this.engine.winX, 
        //     this.y + centerY - bbh/2 - this.engine.winY, 
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