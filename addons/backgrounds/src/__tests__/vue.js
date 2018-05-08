import Vue from 'vue';
import { vueHandler } from '../vue';

import Events from '../events';

describe('Vue handler', () => {
  it('Returns a component with a created function', () => {
    const testChannel = { emit: jest.fn() };
    const testStory = () => ({ template: '<div> testStory </div>' });
    const testContext = {
      kind: 'Foo',
      story: 'bar baz',
    };
    const testBackground = [
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ];
    const component = vueHandler(testChannel, testBackground)(testStory, testContext);

    expect(component).toMatchObject({
      created: expect.any(Function),
      beforeDestroy: expect.any(Function),
      render: expect.any(Function),
    });
  });

  it('Subscribes to the channel on creation', () => {
    const testChannel = { emit: jest.fn() };
    const testStory = () => ({ render: h => h('div', ['testStory']) });
    const testContext = {
      kind: 'Foo',
      story: 'bar baz',
    };
    const testBackground = [
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998', default: true },
    ];

    new Vue(vueHandler(testChannel, testBackground)(testStory, testContext)).$mount();

    expect(testChannel.emit).toHaveBeenCalledTimes(1);
    expect(testChannel.emit).toHaveBeenCalledWith(Events.SET, expect.any(Array));
  });
});
