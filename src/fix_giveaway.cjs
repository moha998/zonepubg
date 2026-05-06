const fs = require('fs');
let text = fs.readFileSync('src/pages/GiveawaysPage.tsx', 'utf8');
text = text.replace("import GameImage from '../components/GameImage';", "");
text = text.replace(/<GameImage/g, '<OptimizedImage');
text = text.replace(/<\/GameImage>/g, '</OptimizedImage>');
fs.writeFileSync('src/pages/GiveawaysPage.tsx', text);
