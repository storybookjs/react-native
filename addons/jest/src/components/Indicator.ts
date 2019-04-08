import React from 'react';

import { styled } from '@storybook/theming';

interface IndicatorProps {
  color: string;
  size: number;
  children?: React.ReactNode;
  right?: boolean;
  overrides?: any;
  styles?: React.CSSProperties;
}

const Indicator = styled.div<IndicatorProps>(
  ({ color, size }) => ({
    boxSizing: 'border-box',
    padding: `0 ${size / 2}px`,
    minWidth: size,
    minHeight: size,
    fontSize: size / 1.4,
    lineHeight: `${size}px`,
    color: 'white',
    textTransform: 'uppercase',
    borderRadius: size / 2,
    backgroundColor: color,
  }),
  ({ overrides }) => ({
    ...overrides,
  })
);

Indicator.defaultProps = {
  right: false,
  children: '',
};

export default Indicator;
