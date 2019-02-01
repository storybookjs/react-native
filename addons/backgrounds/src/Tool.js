import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { SET_STORIES } from '@storybook/core-events';
import { Global } from '@storybook/theming';

import { Popout, Item, Icons, Icon, IconButton, Title, Detail, List } from '@storybook/components';
import * as S from './components';

import { PARAM_KEY } from './constants';

const iframeId = 'storybook-preview-background';

const getState = memoize(10)((props, state) => {
  const data = props.api.getCurrentStoryData();
  const list = data && data.parameters && data.parameters[PARAM_KEY];

  return list && list.length
    ? list.reduce(
        (acc, { name, value, default: isSelected }) => {
          acc.items.push({ name, value });

          if (isSelected && state.selected !== 'transparent') {
            if (!list.find(i => i.value === state.selected)) {
              acc.selected = value;
            }
          }
          return acc;
        },
        {
          items: [],
          selected: state.selected,
        }
      )
    : {
        items: [],
        selected: 'transparent',
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

        <Popout key="backgrounds">
          <IconButton key="background" title="Backgrounds">
            <Icons icon="photo" />
          </IconButton>
          {({ hide }) => (
            <List>
              {selected !== 'transparent' ? (
                <Fragment>
                  <Item
                    key="clear"
                    onClick={() => {
                      hide();
                      this.change('transparent');
                    }}
                  >
                    <Icon type="undo" />
                    <Title>Clear</Title>
                    <Detail>transparent</Detail>
                  </Item>
                </Fragment>
              ) : null}

              {items.map(({ name, value }) => (
                <Item
                  key={name}
                  onClick={() => {
                    hide();
                    this.change(value);
                  }}
                >
                  <Icon type={<S.ColorIcon background={value} />} />
                  <Title>{name}</Title>
                  <Detail>{value}</Detail>
                </Item>
              ))}
            </List>
          )}
        </Popout>
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
