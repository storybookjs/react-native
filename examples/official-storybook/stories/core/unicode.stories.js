import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Core|Unicode', module)
  .add('😀', () => <p>❤️</p>)
  .add('Кнопки', () => <p>нормальный</p>)
  .add('바보', () => <p>🤷🏻‍♂️</p>);
