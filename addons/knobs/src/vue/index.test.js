import Vue from 'vue';
import { vueHandler } from './index';
import KnobStore from '../KnobStore';

describe('Vue handler', () => {
  it('Returns a component with a created function', () => {
    const testChannel = { emit: () => {} };
    const testStory = () => ({ template: '<div> testStory </div>' });
    const testContext = {
      kind: 'Foo',
      story: 'bar baz',
    };

    const testStore = new KnobStore();
    const component = vueHandler(testChannel, testStore)(testStory)(testContext);

    expect(component).toMatchObject({
      created: expect.any(Function),
      beforeDestroy: expect.any(Function),
      render: expect.any(Function),
    });
  });

  it('Subscribes to the channel on creation', () => {
    const testChannel = { emit: () => {}, on: jest.fn() };
    const testStory = () => ({ render: h => h('div', ['testStory']) });
    const testContext = {
      kind: 'Foo',
      story: 'bar baz',
    };

    const testStore = new KnobStore();
    new Vue(vueHandler(testChannel, testStore)(testStory)(testContext)).$mount();

    expect(testChannel.on).toHaveBeenCalledTimes(2);
    expect(testChannel.on).toHaveBeenCalledWith('addon:knobs:reset', expect.any(Function));
    expect(testChannel.on).toHaveBeenCalledWith('addon:knobs:knobChange', expect.any(Function));
  });
});
