import { shallow } from 'enzyme';
import React from 'react';
import addons from '@storybook/addons';

import { EVENT_ID } from '..';
import { mockChannel } from '../preview.test';
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
      wrapper.simulate('click');
      expect(channel.emit).toHaveBeenCalledWith(EVENT_ID, {
        kind: 'foo',
        story: 'bar',
      });
    });
  });
});
