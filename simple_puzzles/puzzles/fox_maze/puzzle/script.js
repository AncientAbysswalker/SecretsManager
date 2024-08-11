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

const engine = new Engine(canvas, ctx, 50, 50);
engine.setMapCollision(mapCollision);


const redKey = new Key(engine, 1*32, 12*32 - 12, keyColor.RED);
const redChest = new Chest(engine, 3*32, 14*32, chestColor.RED, redKey);
engine.addObject(redKey);
engine.addSolidObject(redChest);

let fox = new Fox(engine, 2 * 32, 14 * 32);
engine.setPlayerObject(fox);

engine.startEngine();

// Listen for the window-moved event from the main process
ipcRenderer.on('window-moved', (event, bounds) => {
    engine.setWindowPosition(bounds.x, bounds.y);
});
