import React from 'react';

import WrapStory from './components/WrapStory';

// Run all a11y checks inside
class A11yManager {
  wrapStory(channel, storyFn, context, axeOptions) {
    const props = { context, storyFn, channel, axeOptions };

    return <WrapStory {...props} />;
  }
}

export default A11yManager;
