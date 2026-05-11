const fs = require('fs');
const path = require('path');
const filePath = path.join(process.cwd(), 'traveloop_dataset', 'traveloop_dataset', 'india_tourism_dataset.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log('Keys of first item:', Object.keys(data[0]));
console.log('destination_name of first 5 items:', data.slice(0, 5).map(d => d.destination_name));
