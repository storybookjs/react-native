import runTests from './test_runner';
import { getStorybook } from '@kadira/storybook';
import path from 'path';
import program from 'commander';

const { jasmine } = global;

program
  .option('-c, --config-dir [dir-name]',
          'Directory where to load Storybook configurations from')
  .option('-u, --update [boolean]', 'Update saved story snapshots')
  .option('-i, --update-interactive [boolean]',
          'Update saved story snapshots interactively')
  .option('-g, --grep [string]', 'only test stories matching regexp')
  .parse(process.argv);

const configDir = program.configDir || './.storybook';

const configPath = path.resolve(`${configDir}`, 'config');
require(configPath);

let storybook = getStorybook();

const { update, updateInteractive:updateI, grep } = program;

if(grep) {
  const filteredStorybook = [];
  for (const group of storybook) {
    const re = new RegExp(grep);
    if(re.test(group.kind)){
      filteredStorybook.push(group);
      continue;
    }

    const filteredGroup = {
      kind: group.kind,
      stories: []
    };

    for (const story of group.stories) {
      if(re.test(story.name)){
        filteredGroup.stories.push(story);
        continue;
      }
    }

    if(filteredGroup.stories.length > 0){
      filteredStorybook.push(filteredGroup);
    }
  }

  storybook = filteredStorybook;
}

runTests(storybook, {configDir, update, updateI});
