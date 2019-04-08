import React, { Children, FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

import { ScrollArea } from '../ScrollArea/ScrollArea';

interface SideProps {
  left?: boolean;
  right?: boolean;
}

const Side = styled.div<SideProps>(
  {
    display: 'flex',
    whiteSpace: 'nowrap',
    flexBasis: 'auto',
    flexShrink: 0,
  },
  ({ left }) =>
    left
      ? {
          '& > *': {
            marginLeft: 15,
          },
        }
      : {},
  ({ right }) =>
    right
      ? {
          marginLeft: 30,
          '& > *': {
            marginRight: 15,
          },
        }
      : {}
);
Side.displayName = 'Side';

export const Bar = styled(({ children, className }) => (
  <ScrollArea horizontal className={className}>
    {children}
  </ScrollArea>
))(
  ({ theme }) => ({
    color: theme.barTextColor,
    width: '100%',
    height: 40,
    flexShrink: 0,
  }),

  ({ theme, border }) =>
    border
      ? {
          boxShadow: `${theme.appBorderColor}  0 -1px 0 0 inset`,
          background: theme.barBg,
        }
      : {}
);
Bar.displayName = 'Bar';

const BarInner = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  position: 'relative',
  flexWrap: 'nowrap',
  flexShrink: 0,
  height: 40,
});

interface FlexBarProps {
  border?: boolean;
}

export const FlexBar: FunctionComponent<FlexBarProps> = ({ children, ...rest }) => {
  const [left, right] = Children.toArray(children);
  return (
    <Bar {...rest}>
      <BarInner>
        <Side left>{left}</Side>
        {right ? <Side right>{right}</Side> : null}
      </BarInner>
    </Bar>
  );
};
FlexBar.displayName = 'FlexBar';
