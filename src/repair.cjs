const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Find the start of the mangled part
const cutIndex = content.indexOf('<div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />') + '<div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />'.length;

const goodPart = content.substring(0, cutIndex);
const newPart = fs.readFileSync('src/repair_part.txt', 'utf8');

fs.writeFileSync('src/App.tsx', goodPart + "\n" + newPart);
console.log('Repaired layout!');
