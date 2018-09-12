import deprecate from 'util-deprecate';
import addons, { makeDecorator } from '@storybook/addons';
import { EVENT_ID } from '../shared';

// init function will be executed once when the storybook loads for the
// first time. This is a good place to add global listeners on channel.
export function init() {
  // NOTE nothing to do here
}

function hasOwnProp(object, propName) {
  return Object.prototype.hasOwnProperty.call(object, propName);
}

function withRegexProp(object, propName) {
  return hasOwnProp(object, propName) ? { [propName]: object[propName] } : {};
}

function emitOptions(options) {
  const channel = addons.getChannel();
  if (!channel) {
    throw new Error(
      'Failed to find addon channel. This may be due to https://github.com/storybooks/storybook/issues/1192.'
    );
  }

  // since 'undefined' and 'null' are the valid values we don't want to
  // override the hierarchySeparator or hierarchyRootSeparator if the prop is missing
  channel.emit(EVENT_ID, {
    options: {
      ...options,
      ...withRegexProp(options, 'hierarchySeparator'),
      ...withRegexProp(options, 'hierarchyRootSeparator'),
    },
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
  wrapper: (getStory, context, { options: inputOptions, parameters }) => {
    emitOptions({
      ...globalOptions,
      ...inputOptions,
      ...parameters,
    });

    return getStory(context);
  },
});
