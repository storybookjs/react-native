import React from 'react';
import { shallow } from 'enzyme';

import { BackgroundDecorator } from '../index';

const EventEmitter = require('events');

const testStory = () => () => <p>Hello World!</p>;

describe('Background Decorator', () => {
  it('should exist', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );
    expect(backgroundDecorator).toBeDefined();
  });

  it('should initially have a transparent background state', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );

    expect(backgroundDecorator.state().background).toBe('transparent');
  });

  it('should have a background matching its state', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );

    expect(backgroundDecorator.html().match(/background:transparent/gim).length).toBe(1);
  });

  it('should set internal state when background event called', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );

    SpiedChannel.emit('background', '#123456');
    expect(backgroundDecorator.state().background).toBe('#123456');
  });

  it('should send background-unset event when the component unmounts', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );

    const spy = jest.fn();
    SpiedChannel.on('background-unset', spy);

    backgroundDecorator.unmount();

    expect(spy).toBeCalled();
  });

  it('should send background-set event when the component mounts', () => {
    const SpiedChannel = new EventEmitter();
    const spy = jest.fn();
    SpiedChannel.on('background-set', spy);

    shallow(<BackgroundDecorator story={testStory} channel={SpiedChannel} />);

    expect(spy).toBeCalled();
  });

  it('should update story on change', () => {
    const SpiedChannel = new EventEmitter();
    const nextStory = jest.fn(() => <p>I am next story!</p>);
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );

    backgroundDecorator.setProps({ story: nextStory });
    expect(nextStory).toBeCalled();
  });

  it('should not update story on other props change', () => {
    const SpiedChannel = new EventEmitter();
    const story = jest.fn(() => <p>I am the only one!</p>);
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={story} channel={SpiedChannel} />
    );

    backgroundDecorator.setProps({ randomProp: true });
    expect(story.mock.calls.length).toBe(1);
  });
});
