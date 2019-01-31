import React from 'react';

import { IFrame } from './iframe';

export default {
  Component: IFrame,
  title: 'Components|Preview/Iframe',
};

const style = { width: '100%', height: '500px' };

export const workingStory = () => (
  <IFrame
    id="iframe"
    title="Missing"
    src="/iframe.html?id=ui-panel--default"
    allowFullScreen
    style={style}
  />
);

export const missingStory = () => (
  <IFrame id="iframe" title="Missing" src="/iframe.html?id=missing" allowFullScreen style={style} />
);

export const errorStory = () => (
  <IFrame
    id="iframe"
    title="Missing"
    src="/iframe.html?id=core-errors--story-throws-exception"
    allowFullScreen
    style={style}
  />
);
