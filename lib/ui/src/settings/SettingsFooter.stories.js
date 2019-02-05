import React from 'react';

import SettingsFooter from './SettingsFooter';

export default {
  Component: SettingsFooter,
  title: 'UI|Settings/SettingsFooter',
  decorators: [storyFn => <div style={{ width: '600px', margin: '2rem auto' }}>{storyFn()}</div>],
};

export const basic = () => <SettingsFooter />;
