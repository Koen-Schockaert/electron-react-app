// ...existing code...
const fs = require('fs');
const root = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const appPath = 'release/app/package.json';
const app = JSON.parse(fs.readFileSync(appPath, 'utf8'));
if (app.version !== root.version) {
  app.version = root.version;
  fs.writeFileSync(appPath, JSON.stringify(app, null, 2) + '\n', 'utf8');
  console.log(`Synced release/app/package.json -> ${root.version}`);
} else {
  console.log('Versions already in sync');
}
