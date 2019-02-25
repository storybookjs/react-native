import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { Global } from '@storybook/theming';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { SET_STORIES } from '@storybook/core-events';

import { PARAM_KEY } from './constants';

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

const getState = memoize(10)((props, state, change) => {
  const data = props.api.getCurrentStoryData();
  const list = toList(data && data.parameters && data.parameters[PARAM_KEY]);

  const selected =
    state.selected === 'responsive' || list.find(i => i.id === state.selected)
      ? state.selected
      : list.find(i => i.default) || 'responsive';

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
                border: '10px solid black',
                borderRadius: 4,
                margin: 10,

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
