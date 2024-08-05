const { ipcRenderer } = require('electron');
const { Chest, chestColor } = require('./Chest');
const { Fox } = require('./Fox');
const { Engine } = require('./Engine');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Map data is stored with indices of row then col
const mapCollision = require('./map.json')

// Map
let map = new Image();
// map.src = './6FsdxmA.jpg';
map.src = './testnew.png';

const engine = new Engine(ctx, 50, 50);
engine.setMapCollision(mapCollision);


let redChest = new Chest(chestColor.RED);
engine.addObjectSolid(redChest);

let fox = new Fox(engine, 2 * 32, 14 * 32);

let lastEngineFrame = -1;
tick(0);

function tick(timestamp) {
    const currentEngineFrame = Math.floor(timestamp / 1000 * 30);

    // Only run update once per frame
    if (currentEngineFrame > lastEngineFrame) {
        lastEngineFrame = currentEngineFrame;

        fox.checkAndUpdateMovement();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // ctx.drawImage(map, 300 - winX, 300 - winY);
        
        fox.draw(ctx);

        redChest.draw(ctx);
    
        // Draw map hitboxes
        for (let row = 0; row < mapCollision.length; row++) {
            for (let col = 0; col < mapCollision[row].length; col++) {
                if (mapCollision[row][col]) {
                    ctx.beginPath();
                    ctx.strokeStyle = "yellow";
                    ctx.strokeRect(col * 32 - engine.winX, 
                        row * 32 - engine.winY, 
                        32, 
                        32);
                    ctx.closePath()
                }
            }
        }
    }

    requestAnimationFrame(tick);
}

// Listen for the window-moved event from the main process
ipcRenderer.on('window-moved', (event, bounds) => {
    winX = bounds.x;
    winY = bounds.y;
    engine.setWindowPosition(winX, winY);
});
