import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { Global, styled } from '@storybook/theming';

import { SET_STORIES } from '@storybook/core-events';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PARAM_KEY } from './constants';

export const ColorIcon = styled.span(({ background }) => ({
  borderRadius: '1rem',
  display: 'block',
  height: '1rem',
  width: '1rem',
  background,
}));

const iframeId = 'storybook-preview-background';

const createItem = memoize(1000)((name, value, hasSwatch) =>
  hasSwatch
    ? {
        title: name,
        onClick: () => {
          this.change(value);
        },
        right: <ColorIcon background={value} />,
      }
    : {
        title: name,
        onClick: () => {
          this.change(value);
        },
      }
);

const transparent = [createItem('Reset background', 'transparent', false)];
const getState = memoize(10)((props, state) => {
  const data = props.api.getCurrentStoryData();
  const list = (data && data.parameters && data.parameters[PARAM_KEY]) || [];

  const initial = state.selected === 'transparent' ? transparent : [];

  const items = list.length
    ? initial.concat(list.map(({ name, styles: value }) => createItem(name, value, true)))
    : list;

  const selected =
    state.selected === 'transparent' || list.find(i => i.id === state.selected)
      ? state.selected
      : list.find(i => i.default) || 'transparent';

  return {
    items,
    selected,
  };
});

export default class BackgroundTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      selected: 'transparent',
    };

    this.listener = () => {
      this.setState({ selected: null });
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

  render() {
    const { items, selected } = getState(this.props, this.state);

    return items.length ? (
      <Fragment>
        <Global
          styles={{
            [`#${iframeId}`]: {
              background: selected,
            },
          }}
        />
        <WithTooltip
          placement="top"
          trigger="click"
          tooltip={<TooltipLinkList links={items} />}
          closeOnClick
        >
          <IconButton key="background" title="Backgrounds">
            <Icons icon="photo" />
          </IconButton>
        </WithTooltip>
      </Fragment>
    ) : null;
  }
}
BackgroundTool.propTypes = {
  api: PropTypes.shape({
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
};
BackgroundTool.defaultProps = {
  channel: undefined,
};
