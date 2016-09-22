import path from 'path';
import jestSnapshot from 'jest-snapshot';
import ReactTestRenderer from 'react-test-renderer';
import diff from 'jest-diff';
import promptly from 'promptly';

export default class SnapshotRunner {
  constructor(configDir) {
    this.configDir = configDir;
    this.kind = '';
  }

  startKind(kind) {
    const filePath = path.resolve(this.configDir, kind);

    const fakeJasmine = {
      Spec: () => {}
    };
    this.state = jestSnapshot.getSnapshotState(fakeJasmine, filePath);
    this.kind = kind;
  }

  async runStory(story, {update, interactive}) {
    this.state.setSpecName(story.name);
    this.state.setCounter(0);
    const snapshot = this.state.snapshot;

    const key = story.name;
    const hasSnapshot = snapshot.has(key);
    const context = { kind: this.kind, story };
    const tree = story.render(context);
    const renderer = ReactTestRenderer.create(tree);
    const actual = renderer.toJSON();

    if (!snapshot.fileExists() || !hasSnapshot) {
      // If the file does not exist of snapshot of this name is not present
      // add it.
      snapshot.add(key, actual);
      return {state: 'added'};
    }

    const matches = snapshot.matches(key, actual);
    const pass = matches.pass;
    if (pass) {
      // Snapshot matches with the story
      return {state: 'matched'};
    }

    // Snapshot does not match story
    if (update) {
      snapshot.add(key, actual);
      return {state: 'updated'};
    }

    const diffMessage = diff(
      matches.expected.trim(),
      matches.actual.trim(),
      {
        aAnnotation: 'Snapshot',
        bAnnotation: 'Current story',
      },
    );

    if (interactive) {
      const shouldUpdate = await this.confirmUpate(diffMessage);
      if (shouldUpdate) {
        snapshot.add(key, actual);
        return {state: 'updated'};
      }
    }

    return {state: 'unmatched', message: diffMessage};
  }

  endKind({update}) {
    const snapshot = this.state.snapshot;
    if (update) {
      snapshot.removeUncheckedKeys();
    }
    snapshot.save(update);
  }

  async confirmUpate(diffMessage) {
    process.stdout.write('\nReceived story is different from stored snapshot.\n');
    process.stdout.write('  ' + diffMessage.split('\n').join('\n  '));
    let ans = await promptly.prompt('Update snapshot? (y/n)');
    while (ans !== 'y' && ans !== 'n') {
      process.stdout.write('Enter only y (yes) or n (no)\n');
      ans = await promptly.prompt('Update snapshot? (y/n)');
    }
    process.stdout.write('\n');

    return ans === 'y';
  }
}
