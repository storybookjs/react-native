import * as React from 'react';
import { Separator } from '@storybook/components';
import { MenuController } from '../containers/MenuController';
import { TToolBar } from '../libs/types';

export const ToolBar: TToolBar = React.memo(
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
