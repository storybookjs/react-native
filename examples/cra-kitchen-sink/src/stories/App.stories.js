import React from 'react';
import { storiesOf } from '@storybook/react';

// eslint-disable-next-line import/extensions,import/no-unresolved
import App from 'App';

storiesOf('App', module).add('full app', () => <App />);
