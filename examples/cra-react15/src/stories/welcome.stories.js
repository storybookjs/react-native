import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module)
  .addParameters({
    component: Welcome,
  })
  .add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
