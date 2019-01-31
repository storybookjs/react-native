import { document } from 'global';
import React, { Component } from 'react';
import memoize from 'memoizerific';
import { styled } from '@storybook/theming';

import { logger } from '@storybook/client-logger';
import { Popout, Item, Icons, MenuIcon, IconButton, Title, List } from '@storybook/components';

const getIframe = memoize(1)(() => document.getElementById('storybook-preview-iframe'));

const ColorIcon = styled.span(
  {
    background: 'linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)',
  },
  ({ filter }) => ({
    filter: filter === 'mono' ? 'grayscale(100%)' : `url('#${filter}')`,
  })
);

class ColorBlindness extends Component {
  state = {
    filter: false,
  };

  setFilter = filter => {
    const iframe = getIframe();

    if (iframe) {
      iframe.style.filter = filter === 'mono' ? 'grayscale(100%)' : `url('#${filter}')`;

      this.setState({
        filter,
      });
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  render() {
    const { filter } = this.state;

    return (
      <Popout key="filters">
        <IconButton key="filter" active={!!filter} title="Color Blindness Emulation">
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
                  this.setFilter(filter === i ? null : i);
                  hide();
                }}
              >
                <MenuIcon type={<ColorIcon filter={i} />} />
                <Title>{i}</Title>
              </Item>
            ))}
            <Item
              onClick={() => {
                this.setFilter(filter === 'mono' ? null : 'mono');
                hide();
              }}
            >
              <MenuIcon type={<ColorIcon filter="mono" />} />
              <Title>mono</Title>
            </Item>
            <Item
              onClick={() => {
                this.setFilter(null);
                hide();
              }}
            >
              <MenuIcon type={<ColorIcon />} />
              <Title>Off</Title>
            </Item>
          </List>
        )}
      </Popout>
    );
  }
}

export default ColorBlindness;
