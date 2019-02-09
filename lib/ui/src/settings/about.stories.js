import React from 'react';
import { storiesOf } from '@storybook/react';
import { actions as createActions } from '@storybook/addon-actions';

import AboutScreen from './about';

const info = {
  plain: `- upgrade webpack & babel to latest\n- new addParameters and third argument to .add to pass data to addons\n- added the ability to theme storybook\n- improved ui for mobile devices\n- improved performance of addon-knobs`,
};

const actions = createActions('onClose');
storiesOf('UI|Settings/AboutScreen', module)
  .add('up to date', () => (
    <AboutScreen latest={{ version: '5.0.0', info }} current={{ version: '5.0.0' }} {...actions} />
  ))
  .add('new version required', () => (
    <AboutScreen latest={{ version: '5.0.3', info }} current={{ version: '5.0.0' }} {...actions} />
  ))
  .add('failed to fetch new version', () => (
    <AboutScreen current={{ version: '5.0.0' }} {...actions} />
  ));
