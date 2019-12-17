import { document } from 'global';
import React, { FunctionComponent, ReactNode, useState } from 'react';
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

const ColorIcon = styled.span<{ filter: string | null }>(
  {
    background: 'linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)',
    borderRadius: '1rem',
    display: 'block',
    height: '1rem',
    width: '1rem',
  },
  ({ filter }) => ({
    filter: getFilter(filter),
  }),
  ({ theme }) => ({
    boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  })
);

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

export const ColorBlindness: FunctionComponent = () => {
  const [active, setActiveState] = useState(null);

  const setActive = (activeState: string | null): void => {
    const iframe = getIframe();

    if (iframe) {
      iframe.style.filter = getFilter(activeState);
      setActiveState(activeState);
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltip={({ onHide }) => {
        const colorList = getColorList(active, i => {
          setActive(i);
          onHide();
        });
        return <TooltipLinkList links={colorList} />;
      }}
      closeOnClick
      onDoubleClick={() => setActive(null)}
    >
      <IconButton key="filter" active={!!active} title="Color Blindness Emulation">
        <Icons icon="mirror" />
      </IconButton>
    </WithTooltip>
  );
};
