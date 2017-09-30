import React from 'react';
import { reactHandler } from './index';
import { shallow } from 'enzyme'; // eslint-disable-line
import KnobStore from '../KnobStore';

describe('React Handler', () => {
  describe('wrapStory', () => {
    it('should contain the story and add correct props', () => {
      const testChannel = { emit: jest.fn(), on: jest.fn() };
      const testStory = () => <div id="test-story">Test Content</div>;
      const testContext = {
        kind: 'Foo',
        story: 'bar baz',
      };

      const testStore = new KnobStore();

      const wrappedStory = reactHandler(testChannel, testStore)(testStory)(testContext);
      const wrapper = shallow(wrappedStory);
      expect(wrapper.find('#test-story').length).toBe(1);

      const storyWrapperProps = wrappedStory.props;
      expect(storyWrapperProps.channel).toEqual(testChannel);
      expect(storyWrapperProps.context).toEqual(testContext);
    });
  });
});
