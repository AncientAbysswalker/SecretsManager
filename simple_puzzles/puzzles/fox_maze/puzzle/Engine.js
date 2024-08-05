class Engine {
    constructor(ctx, winX, winY) {
        this.ctx = ctx;
        this.winX = winX;
        this.winY = winY;

        this.mapCollision;
        this.objectSolidList = [];
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
}

module.exports = {
    Engine
}