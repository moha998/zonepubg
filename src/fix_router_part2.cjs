const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add new lazy imports
const lazyImports = `
const RatePage = lazy(() => import("./pages/RatePage"));
const GameEventsPage = lazy(() => import("./pages/GameEventsPage"));
const GiveawaysPage = lazy(() => import("./pages/GiveawaysPage"));
const AdsPage = lazy(() => import("./pages/AdsPage"));
`;

if (!content.includes('const RatePage = lazy(')) {
  content = content.replace('const SensitivityPage = lazy(() => import("./pages/SensitivityPage"));',
    'const SensitivityPage = lazy(() => import("./pages/SensitivityPage"));' + lazyImports);
}

// 2. We need to replace the entire rendering switch block with Routes.
const startStr = '<AnimatePresence mode="wait">';
const endStr = '</AnimatePresence>';

const startIndex = content.indexOf(startStr);
const endIndex = content.lastIndexOf(endStr) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = fs.readFileSync('src/new_routes.txt', 'utf8');
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Replaced with Routes successfully!");
} else {
  console.log("Could not find start/end.");
}
