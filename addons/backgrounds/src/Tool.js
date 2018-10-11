import { document } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Popout, Item, Icons, Icon, IconButton, Title, List } from '@storybook/components';

import Events from './constants';

const storybookIframe = 'storybook-preview-background';
const style = {
  iframe: {
    transition: 'background 0.25s ease-in-out',
  },
};

const ColorIcon = styled.span(({ background }) => ({
  background,
}));

const defaultBackground = {
  name: 'default',
  value: 'transparent',
};

export default class Tool extends Component {
  constructor(props) {
    super(props);

    this.state = { backgrounds: [] };
  }

  componentDidMount() {
    const { api, channel } = this.props;
    channel.on(Events.SET, data => {
      this.iframe = document.getElementById(storybookIframe);

      if (!this.iframe) {
        return;
        // throw new Error('Cannot find Storybook iframe');
      }

      Object.keys(style.iframe).forEach(prop => {
        this.iframe.style[prop] = style.iframe[prop];
      });

      const backgrounds = [...data];

      this.setState({ backgrounds });
      const current = api.getQueryParam('background');
      const defaultOrFirst = backgrounds.find(x => x.default) || backgrounds[0];

      if (current && backgrounds.find(bg => bg.value === current)) {
        this.updateIframe(current);
      } else if (defaultOrFirst) {
        this.updateIframe(defaultOrFirst.value);
        api.setQueryParams({ background: defaultOrFirst.value });
      }
    });

    channel.on(Events.UNSET, () => {
      if (!this.iframe) {
        return;
        // throw new Error('Cannot find Storybook iframe');
      }
      this.setState({ backgrounds: [] });
      this.updateIframe('none');
    });
  }

  setBackgroundFromSwatch = background => {
    const { api } = this.props;
    this.updateIframe(background);
    api.setQueryParams({ background });
  };

  updateIframe(background) {
    this.iframe.style.background = background;
  }

  render() {
    const { backgrounds = [] } = this.state;

    if (!backgrounds.length) {
      // we should just disable the button
    }

    const hasDefault = backgrounds.filter(x => x.default).length;
    if (!hasDefault) backgrounds.push(defaultBackground);

    return (
      <Fragment>
        <Popout key="backgrounds">
          <IconButton key="background" title="Backgrounds">
            <Icons icon="photo" />
          </IconButton>
          {({ hide }) => (
            <List>
              {backgrounds.map(({ value, name }) => (
                <Item
                  key={`${name} ${value}`}
                  onClick={() => {
                    this.setBackgroundFromSwatch(value);

                    hide();
                  }}
                >
                  <Icon type={<ColorIcon background={value} />} />
                  <Title>{value}</Title>
                </Item>
              ))}
            </List>
          )}
        </Popout>
      </Fragment>
    );
  }
}
Tool.propTypes = {
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
Tool.defaultProps = {
  channel: undefined,
};
