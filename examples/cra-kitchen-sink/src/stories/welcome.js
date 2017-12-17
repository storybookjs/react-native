import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { storiesOf } from '@storybook/react';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showKind="Button" />);
