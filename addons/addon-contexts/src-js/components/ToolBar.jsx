import React from 'react';
import { Separator } from '@storybook/components';
import { MenuController } from '../containers/MenuController';

export const ToolBar = React.memo(
  ({ nodes, setSelect }) =>
    !!nodes.length && (
      <>
        <Separator />
        {nodes.map(({ components, ...rest }) => (
          <MenuController {...rest} key={rest.nodeId} setSelect={setSelect} />
        ))}
      </>
    )
);
