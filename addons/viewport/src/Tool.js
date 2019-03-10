import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';
import deprecate from 'util-deprecate';

import { Global } from '@storybook/theming';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { SET_STORIES } from '@storybook/core-events';

import { PARAM_KEY } from './constants';
import { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from './defaults';

const toList = memoize(50)(items =>
  items ? Object.entries(items).map(([id, value]) => ({ ...value, id })) : []
);
const iframeId = 'storybook-preview-iframe';

const createItem = memoize(1000)((id, name, value, change) => ({
  id: id || name,
  title: name,
  onClick: () => {
    change({ selected: id, expanded: false });
  },
  right: `${value.width.replace('px', '')}x${value.height.replace('px', '')}`,
  value,
}));

const flip = ({ width, height }) => ({ height: width, width: height });

const deprecatedViewportString = deprecate(
  () => 0,
  'The viewport parameter must be an object with keys `viewports` and `defaultViewport`'
);
const deprecateOnViewportChange = deprecate(
  () => 0,
  'The viewport parameter `onViewportChange` is no longer supported'
);

const getState = memoize(10)((props, state, change) => {
  const data = props.api.getCurrentStoryData();
  const parameters = data && data.parameters && data.parameters[PARAM_KEY];

  if (parameters && typeof parameters !== 'object') {
    deprecatedViewportString();
  }

  const { disable, viewports, defaultViewport, onViewportChange } = parameters || {};

  if (onViewportChange) {
    deprecateOnViewportChange();
  }

  const list = disable ? [] : toList(viewports || INITIAL_VIEWPORTS);

  const selected =
    state.selected === 'responsive' || list.find(i => i.id === state.selected)
      ? state.selected
      : list.find(i => i.default) || defaultViewport || DEFAULT_VIEWPORT;

  const resets =
    selected !== 'responsive'
      ? [
          {
            id: 'reset',
            title: 'Reset viewport',
            onClick: () => {
              change({ selected: undefined, expanded: false });
            },
          },
          {
            id: 'rotate',
            title: 'Rotate viewport',
            onClick: () => {
              change({ isRotated: !state.isRotated, expanded: false });
            },
          },
        ]
      : [];
  const items = list.length
    ? resets.concat(list.map(({ id, name, styles: value }) => createItem(id, name, value, change)))
    : list;

  return {
    isRotated: state.isRotated,
    items,
    selected,
  };
});

export default class ViewportTool extends Component {
  constructor(props) {
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

  change = (...args) => this.setState(...args);

  render() {
    const { expanded } = this.state;
    const { items, selected, isRotated } = getState(this.props, this.state, this.change);
    const item = items.find(i => i.id === selected);

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

                ...(isRotated ? flip(item.value || {}) : item.value || {}),
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
          <IconButton key="viewport" title="Change the size of the preview" active={!!item}>
            <Icons icon="grow" />
          </IconButton>
        </WithTooltip>
      </Fragment>
    ) : null;
  }
}

ViewportTool.propTypes = {
  api: PropTypes.shape({
    on: PropTypes.func,
  }).isRequired,
};
