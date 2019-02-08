import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { Global } from '@storybook/theming';

import { Popout, Item, Icons, Icon, IconButton, Title, List } from '@storybook/components';
import { SET_STORIES } from '@storybook/core-events';

import { PARAM_KEY } from './constants';

const toList = memoize(50)(items =>
  items ? Object.entries(items).map(([id, value]) => ({ ...value, id })) : []
);
const iframeId = 'storybook-preview-background';

const getState = memoize(10)((props, state) => {
  const data = props.api.getCurrentStoryData();
  const list = toList(data && data.parameters && data.parameters[PARAM_KEY]);

  const items = list.length
    ? list.map(({ name, styles: value, id }) => ({ name, value, id }))
    : list;

  const selected =
    state.selected === 'responsive' || list.find(i => i.id === state.selected)
      ? state.selected
      : list.find(i => i.default) || 'responsive';

  return {
    isRotated: state.isRotated,
    items,
    selected,
  };
});

const flip = ({ width, height }) => ({ height: width, widht: height });

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

    if (!items.length) {
      return null;
    }

    return (
      <Fragment>
        {item && item.value ? (
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
        <Popout key="viewports">
          <IconButton key="viewport" title="Change Viewport">
            <Icons icon="grow" />
          </IconButton>
          {({ hide }) => (
            <List>
              {selected !== 'responsive' ? (
                <Fragment>
                  <Item
                    key="reset"
                    onClick={() => {
                      hide();
                      this.change('responsive');
                    }}
                  >
                    <Icon type="undo" />
                    <Title>Reset (responsive)</Title>
                  </Item>
                  <Item
                    key="rotate"
                    onClick={() => {
                      hide();
                      this.rotate();
                    }}
                  >
                    <Icon type="sync" />
                    <Title>Rotate</Title>
                  </Item>
                </Fragment>
              ) : null}

              {items.map(({ id, name, type }) => (
                <Item
                  key={id}
                  onClick={() => {
                    hide();
                    this.change(id);
                  }}
                >
                  <Icon type={type} />
                  <Title>{name}</Title>
                </Item>
              ))}
            </List>
          )}
        </Popout>
      </Fragment>
    );
  }
}

ViewportTool.propTypes = {
  api: PropTypes.shape({
    on: PropTypes.func,
  }).isRequired,
};
