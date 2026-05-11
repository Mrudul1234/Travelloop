const fs = require('fs');
const path = require('path');

const filePath = path.join('traveloop_dataset', 'traveloop_dataset', 'india_tourism_dataset.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const names = data.map(d => d.destination_name);
console.log(JSON.stringify(names.slice(0, 100), null, 2));
