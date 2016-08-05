import React from 'react';
import _Story from './components/Story';
export const Story = _Story;

const defaultOptions = {
  inline: false,
  header: true,
  source: true,
};

export default {
  addWithInfo(storyName, info, storyFn, _options) {
    if (typeof storyFn !== 'function') {
      if (typeof info === 'function') {
        _options = storyFn;
        storyFn = info;
        info = '';
      } else {
        throw new Error('No story defining function has been specified');
      }
    }

    const options = {
      ...defaultOptions,
      ..._options
    };

    this.add(storyName, (context) => {
      const props = {
        info,
        context,
        showInline: Boolean(options.inline),
        showHeader: Boolean(options.header),
        showSource: Boolean(options.source),
        propTables: options.propTables,
      };

      return (
        <Story {...props}>
          {storyFn(context)}
        </Story>
      );
    });
  }
};
