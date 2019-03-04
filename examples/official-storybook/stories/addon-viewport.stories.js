import React from 'react';
import { storiesOf } from '@storybook/react';

import { styled } from '@storybook/theming';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const Panel = styled.div();

storiesOf('Addons|Viewport', module).add('default', () => (
  <Panel>I don't have problems being rendered using the default viewport.</Panel>
));

storiesOf('Addons|Viewport.Custom Default (Kindle Fire 2)', module)
  .addParameters({
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        kindleFire2: {
          name: 'Kindle Fire 2',
          styles: {
            width: '600px',
            height: '963px',
          },
        },
      },
    },
  })
  .add('Inherited', () => (
    <Panel>
      I've inherited <b>Kindle Fire 2</b> viewport from my parent.
    </Panel>
  ))
  .add(
    'Overridden via "withViewport" parameterized decorator',
    () => (
      <Panel>
        I respect my parents but I should be looking good on <b>iPad</b>.
      </Panel>
    ),
    { viewport: { defaultViewport: 'ipad' } }
  )
  .add('Disabled', () => <Panel>There should be no viewport selector in the toolbar</Panel>, {
    viewport: { disable: true },
  });
