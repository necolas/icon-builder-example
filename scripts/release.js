const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

const exec = command => execSync(command, { stdio: 'inherit' });

const PACKAGES_PATH = path.join(__dirname, '..', 'build');

fs.readdirSync(PACKAGES_PATH).forEach((pack) => {
  const packPath = path.join(PACKAGES_PATH, pack);
  // exec(`cd ${packPath} && npm publish`);
});
