import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { document } from 'global';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';
import memoize from 'memoizerific';

import { Popout, Item, Icons, Icon, IconButton, Title, List } from '@storybook/components';
import { STORY_CHANGED } from '@storybook/core-events';

import { PARAM_KEY } from './constants';

const Container = styled.div({
  padding: 15,
  width: '100%',
  boxSizing: 'border-box',
});
Container.displayName = 'Container';

const toList = memoize(50)(viewports => Object.entries(viewports));

export default class ViewportTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewports: {},
      selected: undefined,
      isRotated: false,
    };
  }

  componentDidMount() {
    const { api } = this.props;
    this.iframe = document.getElementById('storybook-preview-iframe');
    this.iframeClass = 'storybook-preview-iframe-bordered';

    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }

    api.on(STORY_CHANGED, this.onStoryChange);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(STORY_CHANGED, this.onStoryChange);
  }

  onStoryChange = id => {
    const { api } = this.props;
    const viewports = api.getParameters(id, PARAM_KEY);

    if (viewports) {
      this.setState({ viewports });
    }
  };

  change = key => {
    this.setState({ selected: key }, () => {
      this.apply();
    });
  };

  rotate = () => {
    const { isRotated } = this.state;
    this.setState({ isRotated: !isRotated }, () => {
      this.apply();
    });
  };

  apply = () => {
    const { iframe, iframeClass } = this;
    const { isRotated, selected, viewports } = this.state;

    if (selected) {
      const {
        styles: { width: a, height: b },
      } = viewports[selected];
      iframe.style.width = isRotated ? b : a;
      iframe.style.height = isRotated ? a : b;

      if (!iframe.classList.item(iframeClass)) {
        iframe.classList.add(iframeClass);
      }
    } else {
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.classList.remove(iframeClass);
    }
  };

  render() {
    const { iframeClass } = this;
    const { viewports, selected } = this.state;

    return (
      <Fragment>
        <Global
          styles={css({
            [`.${iframeClass}`]: {
              border: '10px solid black',
              borderRadius: 4,
              margin: 10,
            },
          })}
        />
        <Popout key="viewports">
          <IconButton key="viewport" title="Change Viewport">
            <Icons icon="grow" />
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

              {toList(viewports).map(([key, { name, type }]) => (
                <Item
                  key={key}
                  onClick={() => {
                    hide();
                    this.change(key);
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
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    onStory: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
