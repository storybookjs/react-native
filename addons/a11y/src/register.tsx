import React, { Fragment, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

import { ADDON_ID, PANEL_ID } from './constants';
import { ColorBlindness } from './components/ColorBlindness';
import { A11YPanel } from './components/A11YPanel';
import { addons, types } from '@storybook/addons';

const Hidden = styled.div(() => ({
  '&, & svg': {
    position: 'absolute',
    width: 0,
    height: 0,
  },
}));

const PreviewWrapper: FunctionComponent<{}> = p => (
  <Fragment>
    {p.children}
    <Hidden>
      <svg key="svg">
        <defs>
          <filter id="protanopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="protanomaly">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="deuteranomaly">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.95, 0.05,  0, 0, 0 0,  0.433, 0.567, 0, 0 0,  0.475, 0.525, 0, 0 0,  0, 0, 1, 0"
            />
          </filter>
          <filter id="tritanomaly">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="achromatopsia">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="achromatomaly">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>
    </Hidden>
  </Fragment>
);

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    title: '',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <ColorBlindness />,
  });

  addons.add(PANEL_ID, {
    title: 'Accessibility',
    type: types.PANEL,
    render: ({ active, key }) => <A11YPanel key={key} api={api} active={active} />,
  });

  addons.add(PANEL_ID, {
    title: '',
    type: types.PREVIEW,
    render: PreviewWrapper as any,
  });
});
