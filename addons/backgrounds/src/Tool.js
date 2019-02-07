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

const createItem = memoize(1000)((id, name, value, hasSwatch, change) =>
  hasSwatch
    ? {
        id: id || name,
        title: name,
        onClick: () => {
          change({ selected: value, expanded: false });
        },
        value,
        right: <ColorIcon background={value} />,
      }
    : {
        id: id || name,
        title: name,
        onClick: () => {
          change({ selected: value, expanded: false });
        },
        value,
      }
);

const getSelected = (list, state) => {
  if (!list.length) {
    return 'transparent';
  }

  if (state === 'transparent') {
    return state;
  }

  if (list.find(i => i.value === state)) {
    return state;
  }

  if (list.find(i => i.default)) {
    return list.find(i => i.default).value;
  }

  return 'transparent';
};

const getState = memoize(10)((props, state, change) => {
  const data = props.api.getCurrentStoryData();
  const list = (data && data.parameters && data.parameters[PARAM_KEY]) || [];

  const selected = getSelected(list, state.selected);

  const initial =
    selected !== 'transparent'
      ? [createItem('reset', 'Clear background', 'transparent', false, change)]
      : [];

  const items = list.length
    ? initial.concat(list.map(({ id, name, value }) => createItem(id, name, value, true, change)))
    : list;

  return {
    items,
    selected,
  };
});

export default class BackgroundTool extends Component {
  static propTypes = {
    api: PropTypes.shape({
      getQueryParam: PropTypes.func,
      setQueryParams: PropTypes.func,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      selected: undefined,
      expanded: false,
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

  change = (...args) => this.setState(...args);

  render() {
    const { expanded } = this.state;
    const { items, selected } = getState(this.props, this.state, this.change);

    return items.length ? (
      <Fragment>
        {selected ? (
          <Global
            styles={{
              [`#${iframeId}`]: {
                background: selected,
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
          <IconButton key="background" title="Backgrounds">
            <Icons icon="photo" />
          </IconButton>
        </WithTooltip>
      </Fragment>
    ) : null;
  }
}
