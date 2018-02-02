'use strict';

const lodash = require('lodash');
const transform = require('babel-core').transform;

// Transform code to ES5
const getTransformedSourceCode = (originalSource) => transform(originalSource, {
  presets: [ 'react-native' ],
  plugins: [ 'react-native-web' ]
}).code;

// Get the contents of the optimized SVG
// by trimming leading and tailing <svg> tags
const getSVGContent = (source) => source.slice(source.indexOf('>') + 1).slice(0, -6);

/**
 * Template: React components
 */
const getReactSource = ({ componentName, height, width, svgPaths }) => getTransformedSourceCode(`
import createIconComponent from './utils/createIconComponent';
import React from 'react';
const ${componentName} = createIconComponent({ content: <g>${svgPaths}</g>, height: ${height}, width: ${width} });
${componentName}.displayName = '${componentName}';
export default ${componentName};
`);

/**
 * Template: createIconComponent
 */
const getCreateIconSource = () => getTransformedSourceCode(`
import { createElement, StyleSheet } from 'react-native-web';
import React from 'react';
const createIconComponent = ({ content, height, width }) =>
  (props) => createElement('svg', {
    ...props,
    style: StyleSheet.compose(styles.root, props.style),
    viewBox: \`0 0 \${width} \${height}\`
  },
  content);

const styles = StyleSheet.create({
  root: {
    display: 'inline-block',
    fill: 'currentcolor',
    height: '1.25em',
    maxWidth: '100%',
    position: 'relative',
    userSelect: 'none',
    textAlignVertical: 'text-bottom'
  }
});

export default createIconComponent;
`);

/**
 * Template: package.json
 */
const getPackageJsonSource = ({ version }) => `{
  "name": "@acme/react-icons",
  "version": "${version}",
  "peerDependencies": {
    "react": ">=16.2.0",
    "react-native-web": ">=0.3.4"
  }
}`;

const createReactPackage = (svgs, version) => {
  const files = svgs.map((svg) => {
    const { name, width, height } = svg.metadata;
    const componentName = `Icon${lodash.upperFirst(lodash.camelCase(name))}`;
    const svgPaths = getSVGContent(svg.source);
    const source = getReactSource({ componentName, width, height, svgPaths });
    const filepath = `${name}.js`;

    return { filepath, source };
  });

  files.push({
    filepath: 'utils/createIconComponent.js',
    source: getCreateIconSource()
  });

  files.push({
    filepath: 'package.json',
    source: getPackageJsonSource({ version })
  });

  return {
    name: 'react-icons',
    files
  }
}

module.exports = createReactPackage;
