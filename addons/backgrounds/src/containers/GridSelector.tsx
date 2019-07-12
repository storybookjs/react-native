import React, { FunctionComponent } from 'react';

import { useAddonState } from '@storybook/api';
import { Global } from '@storybook/theming';
import { Icons, IconButton } from '@storybook/components';

import { ADDON_ID } from '../constants';

const iframeId = 'storybook-preview-iframe';

export const GridSelector: FunctionComponent = () => {
  const [state, setState] = useAddonState<boolean>(`${ADDON_ID}/grid`);

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
              backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
              backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
              backgroundBlendMode: 'difference',
              backgroundImage: [
                'linear-gradient(rgba(130, 130, 130,0.5) 1px,transparent 1px)',
                'linear-gradient(90deg,rgb(130, 130, 130,0.5) 1px,transparent 1px)',
                'linear-gradient(rgba(130, 130, 130, 0.25) 1px,transparent 1px)',
                'linear-gradient(90deg,rgba(130, 130, 130, 0.25) 1px,transparent 1px)',
              ].join(','),
            },
          }}
        />
      ) : null}
    </IconButton>
  );
};
