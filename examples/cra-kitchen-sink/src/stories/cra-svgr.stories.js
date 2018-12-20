import React from 'react';
import { storiesOf } from '@storybook/react';
import { ReactComponent as Logo } from '../logo.svg';

storiesOf('CRA', module).add('Svgr', () => <Logo />);
