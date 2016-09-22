import jestSnapshot from 'jest-snapshot';
import ReactTestRenderer from 'react-test-renderer';
import diff from 'jest-diff';
import chalk from 'chalk';
import promptly from 'promptly';
import path from 'path';
import { filterStorybook } from './util';

export default async function runTests(storybook, options) {
  const {
    configDir = './.storybook',
    update,
    updateInteractive: updateI,
    grep
  } = options;

  const allTestState = {
    added: 0,
    matched: 0,
    unmatched: 0,
    updated: 0,
    obsolete: 0,
  }

  for (const group of filterStorybook(storybook, grep)) {

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
      const context = { kind: group.kind, story: story.name };
      const tree = story.render(context);
      const renderer = ReactTestRenderer.create(tree);
      const actual = renderer.toJSON()

      if (!snapshot.fileExists() || !hasSnapshot) {
        // If the file does not exist of snapshot of this name is not present
        // add it.
        logState('added', story.name);
        snapshot.add(key, actual);
        allTestState.added++;
        continue;
      }

      const matches = snapshot.matches(key, actual);
      const pass = matches.pass;
      if (pass) {
        // Snapshot matches with the story
        logState('matched', story.name);
        allTestState.matched++;
        continue;
      }

      // Snapshot does not match story
      if(update) {
        snapshot.add(key, actual);
        logState('updated', story.name);
        allTestState.updated++;
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
          allTestState.updated++;
          continue;
        }
      }

      allTestState.unmatched++;
    }

    if(update) {
      snapshot.removeUncheckedKeys();
    }
    snapshot.save(update);
    allTestState.obsolete += snapshot.getUncheckedCount();
    process.stdout.write('\n');
  }
  logAllState(allTestState);
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

function logAllState(state) {
  const { added, matched, unmatched, updated, obsolete } = state;
  const total = added + matched + unmatched + updated;
  process.stdout.write(chalk.bold('Test summary\n'));
  process.stdout.write(`> ${total} stories tested.\n`);
  if(matched > 0) {
    process.stdout.write(chalk.green(`> ${matched}/${total} stories matched with snapshots.\n`));
  }
  if(unmatched > 0) {
    process.stdout.write(chalk.red(`> ${unmatched}/${total} differ from snapshots.\n`));
  }
  if(updated > 0) {
    process.stdout.write(chalk.cyan(`> ${updated} snapshots updated to match current stories.\n`));
  }
  if(added > 0) {
    process.stdout.write(chalk.cyan(`> ${added} snapshots newly added.\n`));
  }
  if(obsolete > 0) {
    process.stdout.write(chalk.cyan(`> ${obsolete} unused snapshots remaining. Run with -u to remove them.\n`));
  }
}

async function confirmUpate() {
  process.stdout.write('\nReceived story is different from stored snapshot.\n');

  let ans = await promptly.prompt('Should this snapshot be updated?(y/n)');
  while(ans != 'y' && ans != 'n'){
    process.stdout.write('Enter only y (yes) or n (no)\n');
    ans = await promptly.prompt('Should this snapshot be updated?(y/n)');
  }
  process.stdout.write('\n');

  return ans === 'y';
}
