import React, { FunctionComponent, memo } from 'react';

import { useAddonState, useParameter } from '@storybook/api';
import { Global } from '@storybook/theming';
import { Icons, IconButton } from '@storybook/components';

import { ADDON_ID, GRID_PARAM_KEY } from '../constants';

export interface BackgroundGridParameters {
  cellSize: number;
}

const iframeId = 'storybook-preview-iframe';

export const GridSelector: FunctionComponent = memo(() => {
  const [state, setState] = useAddonState<boolean>(`${ADDON_ID}/grid`);
  const { cellSize } = useParameter<BackgroundGridParameters>(GRID_PARAM_KEY, { cellSize: 20 });

  return (
    <IconButton
      key="background"
      active={state}
      title="Change the background of the preview"
      onClick={() => setState(!state)}
    >
      <Icons icon="grid" />
      {state ? (
        <Global
          styles={{
            [`#${iframeId}`]: {
              backgroundSize: [
                `${cellSize * 5}px ${cellSize * 5}px`,
                `${cellSize * 5}px ${cellSize * 5}px`,
                `${cellSize}px ${cellSize}px`,
                `${cellSize}px ${cellSize}px`,
              ].join(', '),
              backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
              backgroundBlendMode: 'difference',
              backgroundImage: [
                'linear-gradient(rgba(130, 130, 130, 0.5) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(130, 130, 130, 0.5) 1px, transparent 1px)',
                'linear-gradient(rgba(130, 130, 130, 0.25) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(130, 130, 130, 0.25) 1px, transparent 1px)',
              ].join(', '),
            },
          }}
        />
      ) : null}
    </IconButton>
  );
});
