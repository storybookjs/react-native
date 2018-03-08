import React from 'react';
import addons from '@storybook/addons';
import { shallow } from 'enzyme';
import { configure, Viewport } from '../';

jest.mock('@storybook/addons');

describe('Viewport preview', () => {
  const channel = {
    emit: jest.fn(),
  };
  addons.getChannel.mockReturnValue(channel);

  describe('configure', () => {
    it('publishes configure event with all passed configurations', () => {
      const configs = {
        foo: 'bar',
        john: 'Doe',
      };
      configure(configs);

      expect(channel.emit).toHaveBeenCalledTimes(1);
      expect(channel.emit).toHaveBeenCalledWith('addon:viewport:configure', {
        foo: 'bar',
        john: 'Doe',
      });
    });
  });

  describe('Viewport', () => {
    const props = {
      name: 'iphone6',
      children: '1337',
    };

    let subject;

    beforeEach(() => {
      subject = shallow(<Viewport {...props} />);
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
        expect(channel.emit).toHaveBeenCalledWith('addon:viewport:unsetStoryDefaultViewport');
      });
    });
  });
});
