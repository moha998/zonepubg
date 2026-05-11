const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports
if (!content.includes('import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";')) {
  // Add to react-router-dom imports if exists, or append
  const importStr = 'import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";\n';
  content = content.replace('import { lazy, Suspense } from "react";', 'import { lazy, Suspense } from "react";\n' + importStr);
}

// 2. Replace activeTab state definition with hooks
const activeTabPattern = /const \[activeTab, setActiveTab\] = useState.*?\}\);/s;
if (activeTabPattern.test(content)) {
  const replacement = `const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.substring(1) || "home";
  
  const setActiveTab = (tab: string) => {
    navigate(tab === "home" ? "/" : \`/\${tab}\`);
  };`;
  content = content.replace(activeTabPattern, replacement);
}

// 3. Remove window.history.pushState useEffect (because router handles it)
const pushStateEffectPattern = /useEffect\(\(\) => \{\s*const path = activeTab === "home" \? "\/" : `\/\$\{activeTab\}`;\s*if \(window\.location\.pathname !== path\) \{\s*window\.history\.pushState\(null, "", path\);\s*\}\s*\}, \[activeTab\]\);/s;
content = content.replace(pushStateEffectPattern, '');

// Since the file is HUGE and we don't want to parse it by brute string manipulation to find matching boundaries for the entire activeTab ternaries block, I will replace the wrapper around the pages.

// Currently:
// <AnimatePresence mode="wait">
//   {activeTab === "dashboard" ? (
//       ...
//   ) : activeTab === "home" ? (
//       ...
//   ) : activeTab === "sensitivity" ? (
//       ...
//   ... until news ...
//   ) : (  <- this is 'ads' fallback because it's the last one)
//    <motion.div key="ads" ... >...</div>
//   )}
// </AnimatePresence>

// A safer way is to do this component by component if they are already extracted or just write a regex/string match.
// But some of them are INLINE (dashboard, rate, game-events, giveaways, ads, calculator).
// Let's first extract the Inline ones into separate Pages to make it super clean and robust.

fs.writeFileSync('src/App.tsx', content);
console.log("Updated activeTab logic to react-router.");
