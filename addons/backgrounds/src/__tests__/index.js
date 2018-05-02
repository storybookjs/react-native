import React from 'react';
import { shallow } from 'enzyme';
import EventEmitter from 'events';

import { BackgroundDecorator } from '../index';
import Events from '../events';

const testStory = () => () => <p>Hello World!</p>;

describe('Background Decorator', () => {
  it('should exist', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );
    expect(backgroundDecorator).toBeDefined();
  });

  it('should send background-unset event when the component unmounts', () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(
      <BackgroundDecorator story={testStory} channel={SpiedChannel} />
    );

    const spy = jest.fn();
    SpiedChannel.on(Events.UNSET, spy);

    backgroundDecorator.unmount();

    expect(spy).toBeCalled();
  });

  it('should send background-set event when the component mounts', () => {
    const SpiedChannel = new EventEmitter();
    const spy = jest.fn();
    SpiedChannel.on(Events.SET, spy);

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
    expect(story.mock.calls).toHaveLength(1);
  });
});
