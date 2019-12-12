import { keyframes, styled } from '@storybook/theming';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Loader = styled.div`
  animation: ${spin} 1s linear infinite;
  border-radius: 50%;
  height: 48px;
  left: calc(50% - 24px);
  position: absolute;
  top: calc(50% - 24px);
  width: 48px;
  z-index: 4;
  ${({ theme }) => `
    border: 3px solid ${theme.color.secondary};
  `}
  border-top: 3px solid transparent;
`;
