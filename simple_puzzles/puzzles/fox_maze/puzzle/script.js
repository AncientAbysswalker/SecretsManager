const { ipcRenderer } = require('electron');
const { COLOR } = require('./helpers/color');
const { Chest } = require('./objects/Chest');
const { Key } = require('./objects/Key');
const { Fox } = require('./objects/Fox');
const { MusicNote } = require('./objects/MusicNote');
const { Engine } = require('./Engine');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const debug = false//true;

// Map data is stored with indices of row then col
const mapCollision = require('./map.json')

// Map
let map_lower = new Image();
let map_upper = new Image();
map_lower.src = 'graphics/map/layer_lower.png';
map_upper.src = 'graphics/map/layer_upper.png';

const engine = new Engine(canvas, ctx, 50, 50, debug);
engine.setMapCollision(mapCollision);

// Define Keys and Chests
let keyLocations = {};
let chestLocations = {};
keyLocations[COLOR.RED] = debug ? { x: 32, y: 27 } : { x: 3, y: 29 };
chestLocations[COLOR.RED] = { x: 32, y: 28 };
keyLocations[COLOR.BLUE] = debug ? { x: 30, y: 27 } : { x: 33, y: 5 };
chestLocations[COLOR.BLUE] = { x: 30, y: 28 };
keyLocations[COLOR.GREEN] = debug ? { x: 34, y: 27 } : { x: 57, y: 14 };
chestLocations[COLOR.GREEN] = { x: 34, y: 28 };

// Register Keys and Chests - Colors must match
Object.keys(keyLocations).forEach((color, index) => {
    const key = new Key(engine, keyLocations[color].x * 32, keyLocations[color].y * 32 - 12, color, index);
    const chest = new Chest(engine, chestLocations[color].x * 32, chestLocations[color].y * 32, color, key);

    engine.addObject(key);
    engine.addSolidObject(chest);
});

// Fun music note
musicLocation = debug ? { x: 31, y: 26 } : { x: 43, y: 29 };
const musicNote = new MusicNote(engine, musicLocation.x * 32, musicLocation.y * 32 - 12);
engine.addObject(musicNote);

const foxLocation = debug ? { x: 27, y: 29 } : { x: 2, y: 14 };
let fox = new Fox(engine, foxLocation.x * 32, foxLocation.y * 32 - 2); // -2 to prevent collision at initial spawn location
engine.setPlayerObject(fox);

engine.startEngine();

canvas.addEventListener('click', engine.clickEvent, false);

// Listen for the window-moved event from the main process
ipcRenderer.on('window-moved', (event, bounds) => {
    engine.setWindowPosition(bounds.x, bounds.y);
});
