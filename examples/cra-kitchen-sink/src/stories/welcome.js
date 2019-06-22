import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

storiesOf('Welcome', module)
  .addParameters({
    component: Welcome,
  })
  .add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
