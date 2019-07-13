import { document } from 'global';
import React, { Component, ReactNode } from 'react';
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ColorBlindnessProps {}

interface ColorBlindnessState {
  active: string | null;
}

const baseList = [
  'protanopia',
  'protanomaly',
  'deuteranopia',
  'deuteranomaly',
  'tritanopia',
  'tritanomaly',
  'achromatopsia',
  'achromatomaly',
  'mono',
];

export interface Link {
  id: string;
  title: ReactNode;
  right?: ReactNode;
  active: boolean;
  onClick: () => void;
}

const getColorList = (active: string | null, set: (i: string | null) => void): Link[] => [
  ...(active !== null
    ? [
        {
          id: 'reset',
          title: 'Reset color filter',
          onClick: () => {
            set(null);
          },
          right: undefined,
          active: false,
        },
      ]
    : []),
  ...baseList.map(i => ({
    id: i,
    title: i.charAt(0).toUpperCase() + i.slice(1),
    onClick: () => {
      set(i);
    },
    right: <ColorIcon filter={i} />,
    active: active === i,
  })),
];

export class ColorBlindness extends Component<ColorBlindnessProps, ColorBlindnessState> {
  state: ColorBlindnessState = {
    active: null,
  };

  setActive = (active: string | null) => {
    const iframe = getIframe();

    if (iframe) {
      iframe.style.filter = getFilter(active);
      this.setState({
        active,
      });
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  render() {
    const { active } = this.state;

    return (
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={({ onHide }) => {
          const colorList = getColorList(active, i => {
            this.setActive(i);
            onHide();
          });
          return <TooltipLinkList links={colorList} />;
        }}
        closeOnClick
        onDoubleClick={() => this.setActive(null)}
      >
        <IconButton key="filter" active={!!active} title="Color Blindness Emulation">
          <Icons icon="mirror" />
        </IconButton>
      </WithTooltip>
    );
  }
}
