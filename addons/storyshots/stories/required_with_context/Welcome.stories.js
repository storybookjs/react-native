import React from 'react';

import { storiesOf } from '@storybook/react';  // eslint-disable-line
import { linkTo } from '@storybook/addon-links'; // eslint-disable-line
import { Welcome } from '@storybook/react/demo';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
