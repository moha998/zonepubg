const fs = require('fs');
fs.appendFileSync('src/App.tsx', '\nexport default App;\n');
console.log('Appended');
