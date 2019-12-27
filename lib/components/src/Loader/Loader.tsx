import { keyframes, styled } from '@storybook/theming';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Loader = styled.div(({ theme }) => ({
  animation: `${spin} 1s linear infinite`,
  borderRadius: '50%',
  height: 48,
  left: 'calc(50% - 24px)',
  position: 'absolute',
  top: 'calc(50% - 24px)',
  width: 48,
  zIndex: 4,
  border: `3px solid ${theme.color.secondary}`,
  borderTop: '3px solid transparent',
}));
