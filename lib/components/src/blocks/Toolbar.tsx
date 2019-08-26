import React, { Fragment } from 'react';
import { styled } from '@storybook/theming';

import { window } from 'global';
import { FlexBar } from '../bar/bar';
import { Icons } from '../icon/icon';
import { IconButton } from '../bar/button';

interface ZoomProps {
  zoom: (val: number) => void;
  resetZoom: () => void;
}

interface EjectProps {
  storyId?: string;
  baseUrl?: string;
}

interface BarProps {
  border?: boolean;
}

export type ToolbarProps = BarProps & ZoomProps & EjectProps;

const Zoom: React.FC<ZoomProps> = ({ zoom, resetZoom }) => (
  <>
    <IconButton
      key="zoomin"
      onClick={e => {
        e.preventDefault();
        zoom(0.8);
      }}
      title="Zoom in"
    >
      <Icons icon="zoom" />
    </IconButton>
    <IconButton
      key="zoomout"
      onClick={e => {
        e.preventDefault();
        zoom(1.25);
      }}
      title="Zoom out"
    >
      <Icons icon="zoomout" />
    </IconButton>
    <IconButton
      key="zoomreset"
      onClick={e => {
        e.preventDefault();
        resetZoom();
      }}
      title="Reset zoom"
    >
      <Icons icon="zoomreset" />
    </IconButton>
  </>
);

const Eject: React.FC<EjectProps> = ({ baseUrl, storyId }) => (
  <IconButton
    key="opener"
    onClick={() => window.open(`${baseUrl}?id=${storyId}`)}
    title="Open canvas in new tab"
  >
    <Icons icon="share" />
  </IconButton>
);

const Bar = styled(props => <FlexBar {...props} />)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  transition: 'transform .2s linear',
});

export const Toolbar: React.FC<ToolbarProps> = ({ storyId, baseUrl, zoom, resetZoom, ...rest }) => (
  <Bar {...rest}>
    <Fragment key="left">
      <Zoom {...{ zoom, resetZoom }} />
    </Fragment>
    <Fragment key="right">{storyId && <Eject {...{ storyId, baseUrl }} />}</Fragment>
  </Bar>
);
