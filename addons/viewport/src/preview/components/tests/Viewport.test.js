import React from 'react';
import addons from '@storybook/addons';
import { shallow } from 'enzyme';
import { EventEmitter } from 'events';
import Viewport from '../Viewport';
import { VIEWPORT_CHANGED_EVENT_ID, INITIAL_VIEWPORTS } from '../../../shared';

jest.mock('@storybook/addons');

const noop = () => {};

describe('Viewport', () => {
  const channel = {
    emit: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
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
    channel.on.mockReset();
    channel.removeListener.mockReset();
  });

  describe('componentWillMount', () => {
    it('publishes `set` event with `iphone6`', () => {
      expect(channel.emit).toHaveBeenCalledTimes(1);
      expect(channel.emit).toHaveBeenCalledWith(
        'addon:viewport:setStoryDefaultViewport',
        'iphone6'
      );
    });

    it('should listen to viewport changes', () => {
      channel.on.mockReset();
      subject = shallow(<Viewport {...props} onViewportChange={noop} />);

      expect(channel.on).toHaveBeenCalledTimes(1);
      expect(channel.on).toHaveBeenCalledWith(
        'addon:viewport:viewportChanged',
        noop
      );
    });
  });

  describe('componentWillUnmount', () => {
    it('removes viewport changes listener', () => {
      subject = shallow(<Viewport {...props} onViewportChange={noop} />);
      subject.unmount();
      
      expect(channel.removeListener).toHaveBeenCalledTimes(1);
      expect(channel.removeListener).toHaveBeenCalledWith(
        'addon:viewport:viewportChanged',
        noop
      );
    });
  });

  describe('onViewportChange', () => {
    const emitter = new EventEmitter();
    const propsWithCallback = {
      name: 'unknown',
      children: 'do not exist',
      onViewportChange: jest.fn()
    };

    beforeAll(() => {
      addons.getChannel.mockReturnValue(emitter);
    });

    beforeEach(() => {
      subject = shallow(<Viewport {...propsWithCallback} />);
    });

    it('calls onViewportChange with the newly selected viewport', () => {
      emitter.emit(VIEWPORT_CHANGED_EVENT_ID, {
        viewport: INITIAL_VIEWPORTS.iphone5
      });

      expect(propsWithCallback.onViewportChange).toHaveBeenCalled();
      expect(propsWithCallback.onViewportChange).toHaveBeenCalledWith(
        {
          viewport: INITIAL_VIEWPORTS.iphone5
        }
      );
    });
  });
});
