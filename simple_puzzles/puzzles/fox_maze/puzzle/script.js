const { ipcRenderer } = require('electron');
const { Chest, chestColor } = require('./Chest');
const { Key, keyColor } = require('./Key');
const { Fox } = require('./Fox');
const { Engine } = require('./Engine');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Map data is stored with indices of row then col
const mapCollision = require('./map.json')

// Map
let map_lower = new Image();
let map_upper = new Image();
// map.src = './6FsdxmA.jpg';
map_lower.src = './layer_lower.png';
map_upper.src = './layer_upper.png';

const engine = new Engine(ctx, 50, 50);
engine.setMapCollision(mapCollision);


const redKey = new Key(engine, 1*32, 12*32, keyColor.RED);
const redChest = new Chest(engine, 3*32, 14*32, chestColor.RED);
engine.addObjectSolid(redChest);

let fox = new Fox(engine, 2 * 32, 14 * 32);
engine.setPlayerObject(fox);

let lastEngineFrame = -1;
tick(0);

function tick(timestamp) {
    const currentEngineFrame = Math.floor(timestamp / 1000 * 30);

    // Only run update once per frame
    if (currentEngineFrame > lastEngineFrame) {
        lastEngineFrame = currentEngineFrame;

        fox.checkAndUpdateMovement();

        redKey.update();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background color in case we go outside the maze
        ctx.fillStyle = "#00E098";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Map layers
        engine.submitImageForDraw(0, map_lower, - engine.winX, - engine.winY);
        engine.submitImageForDraw(50, map_upper, - engine.winX, - engine.winY);
        
        fox.draw(ctx);

        redKey.draw(ctx);
        redChest.draw(ctx);
    
        // Draw map hitboxes
        if (engine.drawHitboxes) {
            for (let row = 0; row < mapCollision.length; row++) {
                for (let col = 0; col < mapCollision[row].length; col++) {
                    if (mapCollision[row][col]) {
                        engine.submitBoundingBoxForDraw(99, "yellow",
                            col * 32 - engine.winX, 
                            row * 32 - engine.winY, 
                            32, 
                            32);
                    }
                }
            }
        }

        engine.drawCachedLayers();
    }

    requestAnimationFrame(tick);
}

// Listen for the window-moved event from the main process
ipcRenderer.on('window-moved', (event, bounds) => {
    engine.setWindowPosition(bounds.x, bounds.y);
});
