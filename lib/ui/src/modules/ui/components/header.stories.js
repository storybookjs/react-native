import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Header from './header';

const openShortcutsHelp = action('openShortcutsHelp');
storiesOf('ui/stories/Header', module).add('simple', () => (
  <Header name="name" url="http://google.com" openShortcutsHelp={openShortcutsHelp} />
));
