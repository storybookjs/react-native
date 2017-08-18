import React from 'react';
import { css } from 'glamor';
import { Div } from 'glamorous';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';

import { baseFonts, RoutedLink, MenuLink } from '@storybook/components';

css.global('body', baseFonts);

storiesOf('Navigation', module)
  .add('Routed link', () =>
    <RoutedLink href="/" onClick={action('navigation triggered')}>
      Try clicking with different mouse buttons and modifier keys (shift/ctrl/alt/cmd)
    </RoutedLink>
  )
  .addDecorator(withKnobs)
  .add('Menu link', () =>
    <Div width={number('Container width', 90, { range: true, min: 50, max: 200, step: 10 })}>
      <MenuLink href="/" onClick={action('navigation triggered')} active={boolean('Active', true)}>
        {text('Text', 'Menu link item')}
      </MenuLink>
    </Div>
  );
