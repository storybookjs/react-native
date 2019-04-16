import React from 'react';
import { Separator } from '@storybook/components';
import { ToolbarControl } from './ToolbarControl';
import { TToolBar } from '../@types';

export const ToolBar: TToolBar = React.memo(({ nodes, state, setSelected }) =>
  nodes.length ? (
    <>
      <Separator />
      {nodes.map(({ components, ...forwardProps }) =>
        forwardProps.params.length > 1 ? (
          <ToolbarControl
            {...forwardProps}
            setSelected={setSelected}
            selected={state[forwardProps.nodeId]}
            key={forwardProps.nodeId}
          />
        ) : null
      )}
    </>
  ) : null
);
