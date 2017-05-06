import React from 'react';
import { storiesOf, linkTo } from '@storybook/storybook';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
