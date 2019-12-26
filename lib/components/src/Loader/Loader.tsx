import React from 'react';
import { styled } from '@storybook/theming';
import { rotate360 } from '../shared/animation';

const LoaderWrapper = styled.div(({ theme }) => ({
  borderRadius: '3em',
  cursor: 'progress',
  display: 'inline-block',
  overflow: 'hidden',
  position: 'absolute',
  transition: 'all 200ms ease-out',
  verticalAlign: 'top',
  top: '50%',
  left: '50%',
  marginTop: -16,
  marginLeft: -16,
  height: 32,
  width: 32,
  zIndex: 4,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'rgba(0, 0, 0, 0.03)',
  borderTopColor: 'rgba(0, 0, 0, 0.15)',
  animation: `${rotate360} 0.7s linear infinite`,
}));

export function Loader({ ...props }) {
  return (
    <LoaderWrapper
      aria-label="Content is loading ..."
      aria-live="polite"
      role="status"
      {...props}
    />
  );
}
