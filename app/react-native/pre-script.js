const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
// eslint-disable-next-line import/no-dynamic-require
const { stories } = require(path.join(cwd, '/.storybook/main.js'));

fs.writeFileSync(path.join(cwd, '/storybook.requires.js'), '');

let fileContent = stories
  .map((story) => {
    return `require('${story}');`;
  })
  .join('\n');
fileContent = `


import { getStorybookUI, configure } from '@storybook/react-native';

export const load = (
  (extraRequireFn, m) => configure(
    () => {
      // auto imports
${fileContent}

      // extra
      extraRequireFn()
    },
    m
  )
);

export { getStorybookUI, load as configure }

`;

fs.writeFileSync(path.join(cwd, '/storybook.requires.js'), fileContent, {
  encoding: 'utf8',
  flag: 'w',
});
