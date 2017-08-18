import addons from '@storybook/addons';
import { EVENT_ID } from '../shared';

// init function will be executed once when the storybook loads for the
// first time. This is a good place to add global listeners on channel.
export function init() {
  // NOTE nothing to do here
}

function regExpStringify(exp) {
  if (typeof exp === 'string') return exp;
  if (Object.prototype.toString.call(exp) === '[object RegExp]') return exp.source;
  return null;
}

// setOptions function will send Storybook UI options when the channel is
// ready. If called before, options will be cached until it can be sent.
export function setOptions(newOptions) {
  const channel = addons.getChannel();
  if (!channel) {
    throw new Error(
      'Failed to find addon channel. This may be due to https://github.com/storybooks/storybook/issues/1192.'
    );
  }

  let options = newOptions;

  // since 'undefined' and 'null' are the valid values we don't want to
  // override the hierarchySeparator if the prop is missing
  if (Object.prototype.hasOwnProperty.call(newOptions, 'hierarchySeparator')) {
    options = {
      ...newOptions,
      hierarchySeparator: regExpStringify(newOptions.hierarchySeparator),
    };
  }

  channel.emit(EVENT_ID, { options });
}
