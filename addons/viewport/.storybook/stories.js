import React from 'react';
import { storiesOf } from '@storybook/react';
import { withViewport } from '../src';

storiesOf('Viewport Example', module)
    .addDecorator(withViewport)
    .add('Example', <button>Change viewport sizes below</button>);
