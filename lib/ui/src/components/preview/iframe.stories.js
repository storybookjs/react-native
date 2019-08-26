import React from 'react';

import { IFrame } from './iframe';

export default {
  component: IFrame,
  title: 'UI|Preview/Iframe',
};

const style = { width: '100%', height: '500px' };

export const workingStory = () => (
  <IFrame
    id="iframe"
    title="Missing"
    src="/iframe.html?id=ui-panel--default"
    allowFullScreen
    style={style}
    scale={1.0}
  />
);

export const missingStory = () => (
  <IFrame
    id="iframe"
    title="Missing"
    src="/iframe.html?id=missing"
    allowFullScreen
    style={style}
    scale={1.0}
  />
);

export const errorStory = () => (
  <IFrame
    id="iframe"
    title="Missing"
    src="/iframe.html?id=core-errors--story-throws-exception"
    allowFullScreen
    style={style}
    scale={1.0}
  />
);
// We need to disable this one in Chromatic because the screenshot includes the uploaded URL sadly:
//   eg. https://www.chromaticqa.com/snapshot?appId=5a375b97f4b14f0020b0cda3&id=5c52edb4323f9000249aae72
errorStory.story = {
  parameters: {
    chromatic: { disable: true },
  },
};
