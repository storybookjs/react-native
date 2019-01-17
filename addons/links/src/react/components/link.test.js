import { shallow } from 'enzyme';
import React from 'react';
import addons from '@storybook/addons';

import { SELECT_STORY } from '@storybook/core-events';
import { mockChannel } from '../../preview.test';
import LinkTo from './link';

jest.mock('@storybook/addons');

describe('LinkTo', () => {
  describe('render', () => {
    it('should render a link', async () => {
      const channel = mockChannel();
      addons.getChannel.mockReturnValue(channel);

      const wrapper = shallow(<LinkTo kind="foo" story="bar" />);
      await wrapper.instance().updateHref(wrapper.props());
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should select the kind and story on click', () => {
      const channel = {
        emit: jest.fn(),
        on: jest.fn(),
      };
      addons.getChannel.mockReturnValue(channel);

      const wrapper = shallow(<LinkTo kind="foo" story="bar" />);
      wrapper.simulate('click', { button: 0, preventDefault: () => {} });
      expect(channel.emit.mock.calls).toContainEqual([
        SELECT_STORY,
        {
          kind: 'foo',
          story: 'bar',
        },
      ]);
    });
  });
});
