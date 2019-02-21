import { document } from 'global';
import React, { Component } from 'react';
import memoize from 'memoizerific';
import { styled } from '@storybook/theming';

import { logger } from '@storybook/client-logger';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

const getIframe = memoize(1)(() => document.getElementById('storybook-preview-iframe'));

const ColorIcon = styled.span(
  {
    background: 'linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)',
    borderRadius: '1rem',
    display: 'block',
    height: '1rem',
    width: '1rem',
  },
  ({ filter }) => ({
    filter: filter === 'mono' ? 'grayscale(100%)' : `url('#${filter}')`,
  }),
  ({ theme }) => ({
    boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  })
);

class ColorBlindness extends Component {
  state = {
    expanded: false,
    filter: null,
  };

  setFilter = filter => {
    const iframe = getIframe();

    if (iframe) {
      iframe.style.filter = filter === 'mono' ? 'grayscale(100%)' : `url('#${filter}')`;
      this.setState({
        expanded: false,
        filter,
      });
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  render() {
    const { filter, expanded } = this.state;

    let colorList = [
      'protanopia',
      'protanomaly',
      'deuteranopia',
      'deuteranomaly',
      'tritanopia',
      'tritanomaly',
      'achromatopsia',
      'achromatomaly',
      'mono',
    ].map(i => ({
      id: i,
      title: i,
      onClick: () => {
        this.setFilter(i);
      },
      right: <ColorIcon filter={i} />,
    }));

    if (filter !== null) {
      colorList = [
        {
          title: 'Reset color filter',
          onClick: () => {
            this.setFilter(null);
          },
        },
        ...colorList,
      ];
    }

    return (
      <WithTooltip
        placement="top"
        trigger="click"
        tooltipShown={expanded}
        onVisibilityChange={s => this.setState({ expanded: s })}
        tooltip={<TooltipLinkList links={colorList} />}
        closeOnClick
      >
        <IconButton key="filter" active={!!filter} title="Color Blindness Emulation">
          <Icons icon="mirror" />
        </IconButton>
      </WithTooltip>
    );
  }
}

export default ColorBlindness;
