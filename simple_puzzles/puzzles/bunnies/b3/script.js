const prizeTextMap = require('../prizeTextMap.json');

const bun = 3;
const prizeText = prizeTextMap[bun];

const element = document.getElementById("prize-text");
element.innerText = prizeText;