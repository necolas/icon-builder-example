'use strict';

const getSVGContent = (source) => source.slice(source.indexOf('>') + 1).slice(0, -6);

const createModulePackage = (svgs, version) => {
  const files = svgs.map((svg) => {
    const source = getSVGContent(svg.source);
    const json = JSON.stringify(Object.assign({}, svg, { source }));

    return {
      filepath: `${svg.metadata.name}.js`,
      source: `module.exports = ${json}`
    }
  });

  files.push({
    filepath: 'package.json',
    source: `{
  "name": "@acme/module-icons",
  "version": "${version}"
}`
  });

  return {
    name: 'module-icons',
    files
  };
};

module.exports = createModulePackage;
