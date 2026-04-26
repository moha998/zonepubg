const { execSync } = require('child_process');
try {
  const result = execSync('grep -B 10 -A 2000 "</AnimatePresence>" /.gemini/antigravity/brain/0f30f733-4e31-48f0-9a50-fcc09df8c9da/.system_generated/logs/overview.txt > src/recovered_tail.txt');
  console.log('Recovered!');
} catch (e) {
  console.error("Failed", e.message);
}
