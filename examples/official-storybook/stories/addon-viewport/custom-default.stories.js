import React from 'react';
import { styled } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const Panel = styled.div();

export default {
  title: 'Addons|Viewport.Custom Default (Kindle Fire 2)',
  parameters: {
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
  },
};

export const Inherited = () => (
  <Panel>
    I've inherited <b>Kindle Fire 2</b> viewport from my parent.
  </Panel>
);

export const overriddenViaWithViewportParameterizedDecorator = () => (
  <Panel>
    I respect my parents but I should be looking good on <b>iPad</b>.
  </Panel>
);
overriddenViaWithViewportParameterizedDecorator.story = {
  name: 'Overridden via "withViewport" parameterized decorator',
  parameters: { viewport: { defaultViewport: 'ipad' } },
};

export const Disabled = () => <Panel>There should be no viewport selector in the toolbar</Panel>;
Disabled.story = {
  parameters: {
    viewport: { disable: true },
  },
};
