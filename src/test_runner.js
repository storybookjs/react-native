import jestSnapshot from 'jest-snapshot';
import ReactTestRenderer from 'react-test-renderer';
import diff from 'jest-diff';
import chalk from 'chalk';
import promptly from 'promptly';
import path from 'path';

export default async function runTests(storybook, {configDir, update, updateI}) {
  for (const group of storybook) {

    const filePath = path.resolve(`${configDir}`, `${group.kind}`);
    console.log(chalk.underline(`${group.kind}`));
    const fakeJasmine = {
      Spec: () => {}
    }
    const state = jestSnapshot.getSnapshotState(fakeJasmine, filePath);
    const snapshot = state.snapshot;

    for (const story of group.stories) {
      state.setSpecName(story.name);
      state.setCounter(0);
      const key = `${story.name}`
      const hasSnapshot = snapshot.has(key);
      const tree = story.render();
      const renderer = ReactTestRenderer.create(tree);
      const actual = renderer.toJSON()

      if (!snapshot.fileExists() || !hasSnapshot) {
        // If the file does not exist of snapshot of this name is not present
        // add it.
        logState('added', story.name);
        snapshot.add(key, actual);
        state.added++;
        continue;
      }

      const matches = snapshot.matches(key, actual);
      const pass = matches.pass;
      if (pass) {
        // Snapshot matches with the story
        logState('matched', story.name);
        state.matched++;
        continue;
      }

      // Snapshot does not match story
      if(update) {
        snapshot.add(key, actual);
        logState('updated', story.name);
        state.updated++;
        continue;
      }

      const diffMessage = diff(
        matches.expected.trim(),
        matches.actual.trim(),
        {
          aAnnotation: 'Snapshot',
          bAnnotation: 'Current story',
        },
      );

      logState('unmatched', story.name, { diffMessage });

      if(updateI) {
        const shouldUpdate = await confirmUpate();
        if(shouldUpdate) {
          snapshot.add(key, actual);
          logState('updated', story.name);
          state.updated++;
          continue;
        }
      }

      state.unmatched++;
    }

    snapshot.save(update);
    process.stdout.write('\n');
  }
}

function logState(state, storyName, other) {
  switch (state) {
    case 'added':
      process.stdout.write(chalk.cyan(`+ ${storyName}: Added`));
      break;
    case 'updated':
      process.stdout.write(chalk.cyan(`● ${storyName}: Updated`));
      break;
    case 'matched':
      process.stdout.write(chalk.green(`✓ ${storyName}`));
      break;
    case 'unmatched':
      process.stdout.write('\n');
      process.stdout.write(chalk.red(`✗ ${storyName}\n`));
      process.stdout.write('  ' + other.diffMessage.split('\n').join('\n  '));
      process.stdout.write('\n');
      break;
    default:
      process.stdout.write(`Error occured when testing ${storyName}`);
  }
  process.stdout.write('\n');
}

async function confirmUpate(callback) {
  process.stdout.write('\nReceived story is different from stored snapshot.\n');

  let ans = await promptly.prompt('Should this snapshot be updated?(y/n)');
  while(ans != 'y' && ans != 'n'){
    process.stdout.write('Enter only y (yes) or n (no)\n');
    ans = await promptly.prompt('Should this snapshot be updated?(y/n)');
  }
  process.stdout.write('\n');

  return ans === 'y';
}