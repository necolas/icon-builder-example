const createModulePackage = require('./createModulePackage');
const createReactPackage = require('./createReactPackage');
const del = require('del')
const fs = require('fs-extra');
const path = require('path')
const svgOptimize = require('./svgOptimize');
const version = require('../package.json').version;

const BUILD_PATH = path.join(__dirname, '..', 'build');

// Build the npm packages
const createPackages = (svgDataList) => {
  const packagers = [ createReactPackage, createModulePackage ]; // list other packagers here
  const packages = packagers.map((packager) => packager(svgDataList, version));
  del.sync(BUILD_PATH);
  packages.forEach((pack) => {
    console.log(`Building package: "${pack.name}"`);
    pack.files.forEach((file) => {
      fs.outputFile(path.join(BUILD_PATH, pack.name, file.filepath), file.source);
    })
  });
};

svgOptimize('src/*.svg', createPackages);
