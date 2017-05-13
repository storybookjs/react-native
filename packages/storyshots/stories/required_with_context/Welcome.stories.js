import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { linkTo } from '@kadira/storybook-addon-links';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
