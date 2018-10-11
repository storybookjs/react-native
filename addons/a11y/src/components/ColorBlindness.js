import React, { Component, Fragment } from 'react';

import styled from '@emotion/styled';

import { Popout, Item, Icons, Icon, IconButton, Title, List } from '@storybook/components';

const ColorIcon = styled.span(
  {
    background: 'linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)',
  },
  ({ filter }) => ({
    filter: filter === 'mono' ? 'grayscale(100%)' : `url('#${filter}')`,
  })
);

const Hidden = styled.div(() => ({
  display: 'none',
}));

class ColorBlindness extends Component {
  state = {
    filter: false,
  };

  render() {
    const { filter } = this.state;

    return (
      <Fragment>
        <Hidden>
          <svg key="svg">
            <defs>
              <filter id="protanopia">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0"
                />
              </filter>
              <filter id="protanomaly">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0"
                />
              </filter>
              <filter id="deuteranopia">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0"
                />
              </filter>
              <filter id="deuteranomaly">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0"
                />
              </filter>
              <filter id="tritanopia">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.95, 0.05,  0, 0, 0 0,  0.433, 0.567, 0, 0 0,  0.475, 0.525, 0, 0 0,  0, 0, 1, 0"
                />
              </filter>
              <filter id="tritanomaly">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0"
                />
              </filter>
              <filter id="achromatopsia">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0"
                />
              </filter>
              <filter id="achromatomaly">
                <feColorMatrix
                  in="SourceGraphic"
                  type="matrix"
                  values="0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0"
                />
              </filter>
            </defs>
          </svg>
        </Hidden>
        <Popout key="filters">
          <IconButton key="filter" active={!!filter}>
            <Icons icon="mirror" />
          </IconButton>
          {({ hide }) => (
            <List>
              {[
                'protanopia',
                'protanomaly',
                'deuteranopia',
                'deuteranomaly',
                'tritanopia',
                'tritanomaly',
                'achromatopsia',
                'achromatomaly',
              ].map(i => (
                <Item
                  key={i}
                  onClick={() => {
                    this.setState({ filter: filter === i ? null : i });
                    hide();
                  }}
                >
                  <Icon type={<ColorIcon filter={i} />} />
                  <Title>{i}</Title>
                </Item>
              ))}
              <Item
                onClick={() => {
                  this.setState({ filter: filter === 'mono' ? null : 'mono' });
                  hide();
                }}
              >
                <Icon type={<ColorIcon filter="mono" />} />
                <Title>mono</Title>
              </Item>
              <Item
                onClick={() => {
                  this.setState({ filter: null });
                  hide();
                }}
              >
                <Icon type={<ColorIcon />} />
                <Title>Off</Title>
              </Item>
            </List>
          )}
        </Popout>
      </Fragment>
    );
  }
}

export default ColorBlindness;
