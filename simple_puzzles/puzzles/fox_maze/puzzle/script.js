const { ipcRenderer } = require('electron');
const { COLOR } = require('./helpers/color');
const { Chest } = require('./objects/Chest');
const { Key } = require('./objects/Key');
const { Fox } = require('./objects/Fox');
const { Engine } = require('./Engine');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const dummy = true;

// Map data is stored with indices of row then col
const mapCollision = require('./map.json')

// Map
let map_lower = new Image();
let map_upper = new Image();
// map.src = './6FsdxmA.jpg';
map_lower.src = 'graphics/map/layer_lower.png';
map_upper.src = 'graphics/map/layer_upper.png';

const engine = new Engine(canvas, ctx, 50, 50);
engine.setMapCollision(mapCollision);

// Define Keys and Chests
let keyLocations = {};
let chestLocations = {};
keyLocations[COLOR.RED] = dummy ? { x: 32, y: 27 } : { x: 3, y: 29 };
chestLocations[COLOR.RED] = { x: 32, y: 28 };
keyLocations[COLOR.BLUE] = dummy ? { x: 30, y: 27 } : { x: 33, y: 5 };
chestLocations[COLOR.BLUE] = { x: 30, y: 28 };
keyLocations[COLOR.GREEN] = dummy ? { x: 34, y: 27 } : { x: 57, y: 14 };
chestLocations[COLOR.GREEN] = { x: 34, y: 28 };

// Register Keys and Chests - Colors must match
Object.keys(keyLocations).forEach((color, index) => {
    console.log(index, color)
    const key = new Key(engine, keyLocations[color].x * 32, keyLocations[color].y * 32 - 12, color, index);
    const chest = new Chest(engine, chestLocations[color].x * 32, chestLocations[color].y * 32, color, key);

    engine.addObject(key);
    engine.addSolidObject(chest);
});

const foxLocation = dummy ? { x: 27, y: 29 } : { x: 2, y: 14 };
let fox = new Fox(engine, foxLocation.x * 32, foxLocation.y * 32);
engine.setPlayerObject(fox);

engine.startEngine();

// Listen for the window-moved event from the main process
ipcRenderer.on('window-moved', (event, bounds) => {
    engine.setWindowPosition(bounds.x, bounds.y);
});
