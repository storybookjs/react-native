import React from 'react';
import addons from '@storybook/addons';

import { WrapStory } from './components/WrapStory';

class ViewportManager {
    wrapStory(channel, storyFn, context) {
        const props = { context, storyFn, channel };
        return <WrapStory {...props} />
    }
}

const manager = new ViewportManager();

function withViewport(storyFn, context) {
    const channel = addons.getChannel();
    return manager.wrapStory(channel, storyFn, context);
}

export { withViewport };
