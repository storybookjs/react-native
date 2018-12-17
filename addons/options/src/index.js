import deprecate from 'util-deprecate';
import addons, { makeDecorator } from '@storybook/addons';

import EVENTS from './constants';

function emitOptions(options) {
  const channel = addons.getChannel();
  if (!channel) {
    throw new Error(
      'Failed to find addon channel. This may be due to https://github.com/storybooks/storybook/issues/1192.'
    );
  }

  // since 'undefined' and 'null' are the valid values we don't want to
  // override the hierarchySeparator or hierarchyRootSeparator if the prop is missing
  channel.emit(EVENTS.SET, {
    options,
  });
}

// setOptions function will send Storybook UI options when the channel is
// ready. If called before, options will be cached until it can be sent.
let globalOptions = {};
export const setOptions = deprecate(options => {
  globalOptions = options;
  emitOptions(options);
}, '`setOptions(options)` is deprecated. Please use the `withOptions(options)` decorator globally.');

export const withOptions = makeDecorator({
  name: 'withOptions',
  parameterName: 'options',
  skipIfNoParametersOrOptions: false,
  wrapper: deprecate((getStory, context, { options: inputOptions, parameters }) => {
    // do not send hierachy related options over the channel
    const { hierarchySeparator, hierarchyRootSeparator, ...change } = {
      ...globalOptions,
      ...inputOptions,
      ...parameters,
    };

    if (Object.keys(change).length) {
      emitOptions({
        ...globalOptions,
        ...inputOptions,
        ...parameters,
      });
    }

    // MUTATION !
    // eslint-disable-next-line no-param-reassign
    context.options = {
      ...globalOptions,
      ...inputOptions,
      ...parameters,
    };

    return getStory({
      ...context,
      options: {
        ...globalOptions,
        ...inputOptions,
        ...parameters,
      },
    });
  }, 'withOptions is deprecated, use addParameters({ options: {} }) instead'),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
