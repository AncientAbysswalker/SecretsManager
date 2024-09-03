const prizeTextMap = require('../prizeTextMap.json');

const bun = 0;
const prizeText = prizeTextMap[bun];

console.log(prizeText);
const element = document.getElementById("prize-text");
console.log(element);
element.innerText = prizeText;