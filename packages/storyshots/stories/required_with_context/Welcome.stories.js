import React from 'react';

import { storiesOf } from '@storybook/storybook';
import { linkTo } from '@storybook/storybook-addon-links';

import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
