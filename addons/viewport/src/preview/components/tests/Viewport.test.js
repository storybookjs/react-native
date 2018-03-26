import React from 'react';
import addons from '@storybook/addons';
import { shallow } from 'enzyme';
import Viewport from '../Viewport';

jest.mock('@storybook/addons');

describe('Viewport', () => {
  const channel = {
    emit: jest.fn(),
    on: jest.fn(),
  };

  addons.getChannel.mockReturnValue(channel);

  const props = {
    name: 'iphone6',
    children: '1337',
  };

  let subject;

  beforeEach(() => {
    subject = shallow(<Viewport {...props} />);
  });

  afterEach(() => {
    channel.emit.mockReset();
  });

  describe('componentWillMount', () => {
    it('publishes `set` event with `iphone6`', () => {
      expect(channel.emit).toHaveBeenCalledTimes(1);
      expect(channel.emit).toHaveBeenCalledWith(
        'addon:viewport:setStoryDefaultViewport',
        'iphone6'
      );
    });
  });

  describe('componentWillUnmount', () => {
    beforeEach(() => {
      channel.emit.mockReset();
      subject.unmount();
    });

    it('publishes `unset` event', () => {
      expect(channel.emit).toHaveBeenCalledTimes(1);
      expect(channel.emit).toHaveBeenCalledWith(
        'addon:viewport:unsetStoryDefaultViewport',
        'iphone6'
      );
    });
  });
});
