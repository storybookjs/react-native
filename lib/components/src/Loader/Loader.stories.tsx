import React from 'react';
import { storiesOf } from '@storybook/react';
import { Loader } from './Loader';

storiesOf('Basics/Loader', module).add('infinite state', () => <Loader role="progressbar" />);
