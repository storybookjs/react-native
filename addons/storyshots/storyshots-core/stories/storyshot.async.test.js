import path from 'path';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import initStoryshots, { Stories2SnapsConverter } from '../src';
import { TIMEOUT, EXPECTED_VALUE } from './required_with_context/Async.stories';

initStoryshots({
  asyncJest: true,
  framework: 'react',
  integrityOptions: false,
  configPath: path.join(__dirname, '..', '.storybook'),

  // When async is true we need to provide a test method that
  // calls done() when at the end of the test method
  test: ({ story, context, done }) => {
    expect(done).toBeDefined();

    // This is a storyOf Async (see ./required_with_context/Async.stories)
    if (context.kind === 'Async') {
      const converter = new Stories2SnapsConverter({ snapshotExtension: '.async.storyshot' });
      const snapshotFilename = converter.getSnapshotFileName(context);
      const storyElement = story.render();

      // Mount the component
      let wrapper = mount(storyElement);

      // The Async component should not contain the expected value
      expect(wrapper.find('AsyncTestComponent').contains(EXPECTED_VALUE)).toBe(false);

      // wait until the "Async" component is updated
      setTimeout(() => {
        // Update the wrapper with the changes in the underlying component
        wrapper = wrapper.update();

        // Assert the expected value and the corresponding snapshot
        expect(wrapper.find('AsyncTestComponent').contains(EXPECTED_VALUE)).toBe(true);
        expect(toJson(wrapper)).toMatchSpecificSnapshot(snapshotFilename);

        // finally mark test as done
        done();
      }, TIMEOUT);
    } else {
      // If not async just mark the test as done
      done();
    }
  },
});
