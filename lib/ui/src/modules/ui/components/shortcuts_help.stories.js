import React from 'react';
import ReactModal from 'react-modal';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies
import { document, navigator } from 'global';

import ShortcutsHelp from './shortcuts_help';

const onClose = action('onClose');

const rootElement = document.getElementById('root');
if (rootElement != null) {
  ReactModal.setAppElement(rootElement);
}

// For some reason react-modal causes an segfault (infinite loop maybe?)
// when rendered by storyshots/react-test-renderer
if (!navigator.userAgent.match(/Node\.js/) && !navigator.userAgent.match(/jsdom/)) {
  storiesOf('UI|ShortcutHelp', module).add('default', () => (
    <ShortcutsHelp isOpen onClose={onClose} />
  ));
}
