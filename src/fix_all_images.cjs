const fs = require('fs');

const files = [
  'src/pages/NewsPage.tsx',
  'src/pages/HomePage.tsx',
  'src/pages/RatePage.tsx',
  'src/pages/GameEventsPage.tsx',
  'src/pages/CharactersPage.tsx',
  'src/pages/ComparePage.tsx',
  'src/pages/DashboardPage.tsx',
  'src/pages/EventsPage.tsx',
  'src/pages/LoadoutsPage.tsx',
  'src/pages/SensitivityPage.tsx',
];

for(const f of files) {
  if (fs.existsSync(f)) {
    let t = fs.readFileSync(f, 'utf8');
    t = t.replace(/import GameImage from '.*GameImage';/g, '');
    t = t.replace(/<GameImage/g, '<OptimizedImage');
    t = t.replace(/<\/GameImage>/g, '</OptimizedImage>');
    
    if (t.includes('<OptimizedImage') && !t.includes('import OptimizedImage')) {
      t = "import OptimizedImage from '../components/OptimizedImage';\n" + t;
    }
    
    fs.writeFileSync(f, t);
  }
}
