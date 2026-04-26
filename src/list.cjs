const { execSync } = require('child_process');
try {
  console.log(execSync('ls -laR /.gemini || true').toString());
} catch(e) { console.log(e.message); }
