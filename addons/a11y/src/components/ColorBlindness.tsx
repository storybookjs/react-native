import { document } from 'global';
import React, { Component } from 'react';
import memoize from 'memoizerific';
import { styled } from '@storybook/theming';

import { logger } from '@storybook/client-logger';
import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

const getIframe = memoize(1)(() => document.getElementById('storybook-preview-iframe'));

const getFilter = (filter: string | null) => {
  if (filter === null) {
    return 'none';
  }
  if (filter === 'mono') {
    return 'grayscale(100%)';
  }
  return `url('#${filter}')`;
};

const ColorIcon = styled.span(
  {
    background: 'linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)',
    borderRadius: '1rem',
    display: 'block',
    height: '1rem',
    width: '1rem',
  },
  ({ filter }: { filter: string | null }) => ({
    filter: getFilter(filter),
  }),
  ({ theme }) => ({
    boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  })
);

// tslint:disable-next-line:no-empty-interface
interface ColorBlindnessProps {}

interface ColorBlindnessState {
  expanded: boolean;
  filter: string | null;
}

export class ColorBlindness extends Component<ColorBlindnessProps, ColorBlindnessState> {
  state: ColorBlindnessState = {
    expanded: false,
    filter: null,
  };

  setFilter = (filter: string | null) => {
    const iframe = getIframe();

    if (iframe) {
      iframe.style.filter = getFilter(filter);
      this.setState({
        expanded: false,
        filter,
      });
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  onVisibilityChange = (s: boolean) => {
    if (this.state.expanded !== s) {
      this.setState({ expanded: s });
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
      active: filter === i,
    }));

    if (filter !== null) {
      colorList = [
        {
          id: 'reset',
          title: 'Reset color filter',
          onClick: () => {
            this.setFilter(null);
          },
          right: undefined,
          active: false,
        },
        ...colorList,
      ];
    }

    return (
      <WithTooltip
        placement="top"
        trigger="click"
        tooltipShown={expanded}
        onVisibilityChange={this.onVisibilityChange}
        tooltip={<TooltipLinkList links={colorList} />}
        closeOnClick
        onDoubleClick={() => this.setFilter(null)}
      >
        <IconButton key="filter" active={!!filter} title="Color Blindness Emulation">
          <Icons icon="mirror" />
        </IconButton>
      </WithTooltip>
    );
  }
}
