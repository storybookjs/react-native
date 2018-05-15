import deprecate from 'util-deprecate';
import { makeDecorator } from './make-decorator';
import { defaultDecorateStory } from '../../../lib/core/src/client/preview/client_api';

jest.mock('util-deprecate');
let deprecatedFns = [];
deprecate.mockImplementation((fn, warning) => {
  const deprecatedFn = jest.fn(fn);
  deprecatedFns.push({
    deprecatedFn,
    warning,
  });
  return deprecatedFn;
});

describe('makeDecorator', () => {
  it('returns a decorator that passes parameters on the parameters argument', () => {
    const wrapper = jest.fn();
    const decorator = makeDecorator({ wrapper, name: 'test', parameterName: 'test' });
    const story = jest.fn();
    const decoratedStory = defaultDecorateStory(story, [decorator]);

    const context = { parameters: { test: 'test-val' } };
    decoratedStory(context);

    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, { parameters: 'test-val' });
  });

  it('passes options added at decoration time', () => {
    const wrapper = jest.fn();
    const decorator = makeDecorator({ wrapper, name: 'test', parameterName: 'test' });
    const story = jest.fn();
    const options = 'test-val';
    const decoratedStory = defaultDecorateStory(story, [decorator(options)]);

    const context = {};
    decoratedStory(context);

    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, { options: 'test-val' });
  });

  it('passes both options *and* parameters at the same time', () => {
    const wrapper = jest.fn();
    const decorator = makeDecorator({ wrapper, name: 'test', parameterName: 'test' });
    const story = jest.fn();
    const options = 'test-val';
    const decoratedStory = defaultDecorateStory(story, [decorator(options)]);

    const context = { parameters: { test: 'test-val' } };
    decoratedStory(context);

    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
      options: 'test-val',
      parameters: 'test-val',
    });
  });

  it('passes options added at story time, but with a deprecation warning', () => {
    deprecatedFns = [];
    const wrapper = jest.fn();
    const decorator = makeDecorator({ wrapper, name: 'test', parameterName: 'test' });
    const options = 'test-val';
    const story = jest.fn();
    const decoratedStory = decorator(options)(story);
    expect(deprecatedFns).toHaveLength(1);
    expect(deprecatedFns[0].warning).toMatch('addDecorator(test)');

    const context = {};
    decoratedStory(context);

    expect(wrapper).toHaveBeenCalledWith(expect.any(Function), context, {
      options: 'test-val',
    });
    expect(deprecatedFns[0].deprecatedFn).toHaveBeenCalled();
  });
});
