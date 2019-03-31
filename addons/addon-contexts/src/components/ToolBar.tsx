import React from 'react';
import { Separator } from '@storybook/components';
import { MenuController } from '../containers/MenuController';
import { TToolBar } from '../@types';

export const ToolBar: TToolBar = React.memo(({ nodes, setSelect }) =>
  nodes.length ? (
    <>
      <Separator />
      {nodes.map(({ components, ...props }) =>
        props.params.length > 1 ? (
          <MenuController {...props} key={props.nodeId} setSelect={setSelect} />
        ) : null
      )}
    </>
  ) : null
);
