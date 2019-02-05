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
const iframeId = 'storybook-preview-background';

const responsive = [
  {
    title: 'Reset viewport',
    onClick: () => {
      this.change(undefined);
    },
  },
  {
    title: 'Rotate viewport',
    onClick: () => {
      this.rotate();
    },
  },
];

const createItem = memoize(1000)((name, value) => ({
  title: name,
  onClick: () => {
    this.change(value);
  },
  right: `${value.width}-${value.height}`,
}));

const flip = ({ width, height }) => ({ height: width, widht: height });

const getState = memoize(10)((props, state) => {
  const data = props.api.getCurrentStoryData();
  const list = toList(data && data.parameters && data.parameters[PARAM_KEY]);

  const selected =
    state.selected === 'responsive' || list.find(i => i.id === state.selected)
      ? state.selected
      : list.find(i => i.default) || 'responsive';

  const initial = selected === 'responsive' ? responsive : [];
  const items = list.length
    ? initial.concat(list.map(({ name, styles: value }) => createItem({ name, value })))
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

  change = selected => {
    this.setState({ selected });
  };

  rotate = () => {
    const { isRotated } = this.state;
    this.setState({ isRotated: !isRotated });
  };

  render() {
    const { items, selected, isRotated } = getState(this.props, this.state);
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
          tooltip={<TooltipLinkList links={items} />}
          closeOnClick
        >
          <IconButton key="viewport" title="Change Viewport">
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
