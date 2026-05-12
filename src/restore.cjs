const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/App.tsx');
  console.log('Restored App.tsx from git');
} catch (e) {
  console.error('Git checkout failed', e.message);
}
