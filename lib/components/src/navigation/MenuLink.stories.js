import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, text, number } from '@storybook/addon-knobs';

import MenuLink from './MenuLink';

storiesOf('Components|Navigation/MenuLink', module)
  .add('default', () => <MenuLink href="http://google.com">Link</MenuLink>)
  .add('active', () => (
    <MenuLink active href="http://google.com">
      Link
    </MenuLink>
  ))
  .addDecorator(withKnobs)
  .add('with knobs', () => (
    <div
      style={{
        width: number('Container width', 90, {
          range: true,
          min: 50,
          max: 200,
          step: 10,
        }),
      }}
    >
      <MenuLink href="/" onClick={action('navigation triggered')} active={boolean('Active', true)}>
        {text('Text', 'Menu link item')}
      </MenuLink>
    </div>
  ));
