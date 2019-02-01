import { document } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { logger } from '@storybook/client-logger';
import { SET_STORIES } from '@storybook/core-events';

import { Popout, Item, Icons, Icon, IconButton, Title, Detail, List } from '@storybook/components';
import * as S from './components';

import { PARAM_KEY } from './constants';

const toList = memoize(50)((items = {}) => Object.entries(items));
const getIframe = memoize(1)(() => document.getElementById('storybook-preview-background'));

const getState = (props, state) => {
  const data = props.api.getCurrentStoryData();
  const backgrounds = data && data.parameters && data.parameters[PARAM_KEY];
  const list = backgrounds ? toList(backgrounds) : [];

  return list && list.length
    ? list.reduce(
        (acc, { name, value, default: isSelected }) => {
          acc.backgrounds.push(value);

          if (isSelected) {
            acc.selected = name;
          }
          return acc;
        },
        {
          backgrounds: [],
          selected: state.selected,
        }
      )
    : {
        backgrounds: [],
        selected: undefined,
      };
};

export default class BackgroundTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgrounds: {},
      selected: undefined,
    };
  }

  componentDidMount() {
    const { api } = this.props;

    api.on(SET_STORIES, () => {
      const { state, props } = this;
      this.setState(getState(props, state));
    });
  }

  static getDerivedStateFromProps(props, state) {
    return getState(props, state);
  }

  apply = () => {
    const iframe = getIframe();
    if (iframe) {
      const { selected, backgrounds } = this.state;

      if (selected) {
        const value = backgrounds[selected];
        if (backgrounds[selected]) {
          iframe.style.background = value;
        } else {
          logger.error(selected, 'could not be set');
        }
      } else {
        iframe.style.background = 'transparent';
      }
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  change = key => {
    this.setState({ selected: key }, this.apply);
  };

  render() {
    const { backgrounds, selected } = this.state;

    return backgrounds.length ? (
      <Popout key="backgrounds">
        <IconButton key="background" title="Backgrounds">
          <Icons icon="photo" />
        </IconButton>
        {({ hide }) => (
          <List>
            {selected !== undefined ? (
              <Fragment>
                <Item
                  key="reset"
                  onClick={() => {
                    hide();
                    this.change(undefined);
                  }}
                >
                  <Icon type="undo" />
                  <Title>Reset</Title>
                  <Detail>transparent</Detail>
                </Item>
              </Fragment>
            ) : null}

            {backgrounds.map(([key, value]) => (
              <Item
                key={key}
                onClick={() => {
                  hide();
                  this.change(key);
                }}
              >
                <Icon type={<S.ColorIcon background={value} />} />
                <Title>{key}</Title>
                <Detail>{value}</Detail>
              </Item>
            ))}
          </List>
        )}
      </Popout>
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
