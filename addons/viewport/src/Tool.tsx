import React, { Component, Fragment } from 'react';
import memoize from 'memoizerific';
import deprecate from 'util-deprecate';

import { styled, Global } from '@storybook/theming';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { SET_STORIES } from '@storybook/core-events';

import { PARAM_KEY } from './constants';
import { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from './defaults';
import { ViewportAddonParameter, ViewportMap, ViewportStyles } from './models';

const toList = memoize(50)((items: ViewportMap) =>
  items ? Object.entries(items).map(([id, value]) => ({ ...value, id })) : []
);
const iframeId = 'storybook-preview-iframe';

interface ViewportVM {
  id: string;
  title: string;
  onClick: () => void;
  right: string;
  value: ViewportStyles;
}

const createItem = memoize(1000)(
  (id: string, name: string, value: ViewportStyles, change: (...args: unknown[]) => void) => {
    const result: ViewportVM = {
      id: id || name,
      title: name,
      onClick: () => {
        change({ selected: id, expanded: false });
      },
      right: `${value.width.replace('px', '')}x${value.height.replace('px', '')}`,
      value,
    };
    return result;
  }
);

const flip = ({ width, height }: ViewportStyles) => ({ height: width, width: height });

const deprecatedViewportString = deprecate(
  () => 0,
  'The viewport parameter must be an object with keys `viewports` and `defaultViewport`'
);
const deprecateOnViewportChange = deprecate(
  () => 0,
  'The viewport parameter `onViewportChange` is no longer supported'
);

const getState = memoize(10)(
  (
    props: ViewportToolProps,
    state: ViewportToolState,
    change: (statePatch: Partial<ViewportToolState>) => void
  ) => {
    const data = props.api.getCurrentStoryData();
    const parameters: ViewportAddonParameter =
      data && (data as any).parameters && (data as any).parameters[PARAM_KEY];

    if (parameters && typeof parameters !== 'object') {
      deprecatedViewportString();
    }

    const { disable, viewports, defaultViewport, onViewportChange } = parameters || ({} as any);

    if (onViewportChange) {
      deprecateOnViewportChange();
    }

    const list = disable ? [] : toList(viewports || INITIAL_VIEWPORTS);
    const viewportVMList = list.map(({ id, name, styles: value }) =>
      createItem(id, name, value, change)
    );

    const selected =
      state.selected === 'responsive' || list.find(i => i.id === state.selected)
        ? state.selected
        : list.find(i => i.default) || defaultViewport || DEFAULT_VIEWPORT;

    const resets: ViewportVM[] =
      selected !== 'responsive'
        ? [
            {
              id: 'reset',
              title: 'Reset viewport',
              onClick: () => {
                change({ selected: undefined, expanded: false });
              },
              right: undefined,
              value: undefined,
            },
            {
              id: 'rotate',
              title: 'Rotate viewport',
              onClick: () => {
                change({ isRotated: !state.isRotated, expanded: false });
              },
              right: undefined,
              value: undefined,
            },
          ]
        : [];

    const items = viewportVMList.length !== 0 ? resets.concat(viewportVMList) : [];

    return {
      isRotated: state.isRotated,
      items,
      selected,
    };
  }
);

const ActiveViewportSize = styled.div(() => ({
  display: 'inline-flex',
}));

const ActiveViewportLabel = styled.div<{}>(({ theme }) => ({
  display: 'inline-block',
  textDecoration: 'none',
  padding: '10px',
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2 - 1,
  lineHeight: 1,
  height: 40,
  border: 'none',
  borderTop: '3px solid transparent',
  borderBottom: '3px solid transparent',
  background: 'transparent',
}));

const IconButtonWithLabel = styled(IconButton)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
}));

const IconButtonLabel = styled.div<{}>(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
  marginLeft: '10px',
}));

interface ViewportToolState {
  isRotated: boolean;
  items: any[];
  selected: string;
  expanded: boolean;
}
interface ViewportToolProps {
  api: any;
}

export class ViewportTool extends Component<ViewportToolProps, ViewportToolState> {
  listener: () => void;

  constructor(props: ViewportToolProps) {
    super(props);

    this.state = {
      isRotated: false,
      items: [],
      selected: 'responsive',
      expanded: false,
    };

    this.listener = () => {
      this.setState({
        selected: null,
      });
    };
  }

  componentDidMount() {
    const { api } = this.props;
    api.on(SET_STORIES, this.listener);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(SET_STORIES, this.listener);
  }

  // @ts-ignore
  change = (...args: any[]) => this.setState(...args);

  flipViewport = () =>
    this.setState(({ isRotated }: { isRotated: boolean }) => ({
      isRotated: !isRotated,
      expanded: false,
    }));

  resetViewport = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    this.setState({ selected: undefined, expanded: false });
  };

  render() {
    const { expanded } = this.state;
    const { items, selected, isRotated } = getState(this.props, this.state, this.change);
    const item = items.find(i => i.id === selected);

    let viewportX = '0';
    let viewportY = '0';
    let viewportTitle = '';
    if (item) {
      const height = item.value.height.replace('px', '');
      const width = item.value.width.replace('px', '');

      viewportX = isRotated ? height : width;
      viewportY = isRotated ? width : height;

      viewportTitle = isRotated ? `${item.title} (L)` : `${item.title} (P)`;
    }

    return items.length ? (
      <Fragment>
        {item ? (
          <Global
            styles={{
              [`#${iframeId}`]: {
                position: 'relative',
                display: 'block',
                margin: '10px auto',
                border: '1px solid #888',
                borderRadius: 4,
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08);',
                boxSizing: 'content-box',

                ...(isRotated ? flip(item.value) : item.value),
              },
            }}
          />
        ) : null}
        <WithTooltip
          placement="top"
          trigger="click"
          tooltipShown={expanded}
          onVisibilityChange={s => this.setState({ expanded: s })}
          tooltip={<TooltipLinkList links={items} />}
          closeOnClick
        >
          <IconButtonWithLabel
            key="viewport"
            title="Change the size of the preview"
            active={!!item}
            onDoubleClick={e => this.resetViewport(e)}
          >
            <Icons icon="grow" />
            <IconButtonLabel>{viewportTitle}</IconButtonLabel>
          </IconButtonWithLabel>
        </WithTooltip>
        {item ? (
          <ActiveViewportSize>
            <ActiveViewportLabel title="Viewport width">{viewportX}</ActiveViewportLabel>
            <IconButton key="viewport-rotate" title="Rotate viewport" onClick={this.flipViewport}>
              <Icons icon="transfer" />
            </IconButton>
            <ActiveViewportLabel title="Viewport height">{viewportY}</ActiveViewportLabel>
          </ActiveViewportSize>
        ) : null}
      </Fragment>
    ) : null;
  }
}
