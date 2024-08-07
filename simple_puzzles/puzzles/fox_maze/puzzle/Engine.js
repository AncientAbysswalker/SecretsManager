class Engine {
    constructor(ctx, winX, winY) {
        // Context and Window
        this.ctx = ctx;
        this.winX = winX;
        this.winY = winY;

        // Game Object Information
        this.mapCollision;
        this.playerObject;
        this.renderList = [];
        this.objectList = [];
        this.solidObjectList = [];

        // Drawing
        this.drawHitboxes = true;
        this.renderCache = {};
    }

    setPlayerObject(playerObject) {
        this.playerObject = playerObject;
    }

    getPlayerObject() {
        return this.playerObject;
    }

    setMapCollision(mapCollision) {
        this.mapCollision = mapCollision;
    }

    getMapCollision(row, col) {
        return this.mapCollision[row][col];
    }

    addObject(o) {
        this.renderList.push(o);
        this.objectList.push(o);
    }

    addSolidObject(o) {
        this.renderList.push(o);
        this.solidObjectList.push(o);
    }

    removeObject(o) {
        console.log('remove')
        const renderIndex = this.renderList.findIndex(i => i === o);
        const objectIndex = this.objectList.findIndex(i => i === o);

        console.log(this.renderList.length)
        if (renderIndex !== -1 && objectIndex !== -1) {
            this.renderList.splice(renderIndex, 1);
            this.objectList.splice(objectIndex, 1);
        }
        console.log(this.renderList.length)
    }

    removeSolidObject(o) {
        this.renderList.remove(o);
        this.solidObjectList.remove(o);
    }

    getRenderList() {
        return this.renderList;
    }

    getObjectList() {
        return this.objectList;
    }

    getSolidObjectList() {
        return this.solidObjectList;
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