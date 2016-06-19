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
        propTypes: options.propTypes,
      };

      return (
        <Story {...props}>
          {storyFn(context)}
        </Story>
      );
    });
  }
};
