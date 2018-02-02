'use strict';

const fs = require('fs-extra');
const glob = require('glob');
const lodash = require('lodash');
const path = require('path');
const SVGO = require('svgo');

const svgo = new SVGO({});

// Get the icon name
const getName = (filepath) => path.basename(filepath, path.extname(filepath));

// Build the optimized SVG data
const svgOptimize = (globPattern, callback) => {
  const dataList = [];
  const filepaths = glob.sync(globPattern);
  filepaths.forEach((filepath) => {
    const name = getName(filepath);
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) { throw err; }
      console.log(`Optimizing icon: "${name}"`);
      svgo.optimize(data, { path: filepath }).then(result => {
        const data = {};
        data.metadata = result.info;
        data.metadata.name = lodash.kebabCase(name);
        data.source = result.data;
        dataList.push(data);
        if (dataList.length === filepaths.length) {
          callback(dataList);
        }
      }).catch((err) => {
        console.error(err);
      });
    });
  });
};

module.exports = svgOptimize;
