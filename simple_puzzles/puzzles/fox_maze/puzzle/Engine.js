class Engine {
    constructor(ctx, winX, winY) {
        // Context and Window
        this.ctx = ctx;
        this.winX = winX;
        this.winY = winY;

        // Collision Information
        this.mapCollision;
        this.objectSolidList = [];

        // Drawing
        this.drawHitboxes = false;
        this.renderCache = {};
    }

    setMapCollision(mapCollision) {
        this.mapCollision = mapCollision;
    }

    getMapCollision(row, col) {
        return this.mapCollision[row][col];
    }

    addObjectSolid(o) {
        this.objectSolidList.push(o);
    }

    getObjectSolidList() {
        return this.objectSolidList;
    }

    setWindowPosition(winX, winY) {
        this.winX = winX;
        this.winY = winY;
    }

    submitImageForDraw(zIndex, ...args) {
        if (!(zIndex in this.renderCache)) {
            this.renderCache[zIndex] = [];
        }

        this.renderCache[zIndex].push(() => this.ctx.drawImage(...args));
    }

    submitBoundingBoxForDraw(zIndex, color, ...args) {
        if (!(zIndex in this.renderCache)) {
            this.renderCache[zIndex] = [];
        }

        this.renderCache[zIndex].push(() => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(...args);
            this.ctx.closePath()
        });
    }

    drawCachedLayers() {
        for (const zIndex of Object.keys(this.renderCache).sort((a, b) => a - b)) {
            for (const cachedDraw of this.renderCache[zIndex]) {
                cachedDraw();
            }
        }

        // Clear Cache
        this.renderCache = {};
    }
}

module.exports = {
    Engine
}