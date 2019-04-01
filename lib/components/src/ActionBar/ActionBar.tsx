import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';

const Container = styled.div(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  maxWidth: '100%',
  display: 'flex',
  background: theme.background.content,
}));

export const ActionButton = styled.button(({ theme }) => ({
  border: '0 none',
  padding: '4px 10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',

  color: theme.color.defaultText,
  background: theme.background.content,

  fontSize: 12,
  lineHeight: '16px',
  fontWeight: theme.typography.weight.bold,

  borderTop: `1px solid ${theme.appBorderColor}`,
  borderLeft: `1px solid ${theme.appBorderColor}`,
  marginLeft: -1,

  borderRadius: `4px 0 0 0`,

  '&:not(:last-child)': { borderRight: `1px solid ${theme.appBorderColor}` },
  '& + *': {
    borderLeft: `1px solid ${theme.appBorderColor}`,
    borderRadius: 0,
  },

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 -3px 0 0 inset`,
    outline: '0 none',
  },
}));
ActionButton.displayName = 'ActionButton';

export interface ActionItem {
  title: string | JSX.Element;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface ActionBarProps {
  actionItems: ActionItem[];
}

// Need to define ActionBar using old fashioned `function ActionBar` to avoid TS compiler to
// generate an anonymous function instead of naming it ActionBar...
// See https://github.com/storybooks/storybook/pull/6095#issuecomment-477480930
// tslint:disable-next-line:no-shadowed-variable
export const ActionBar: FunctionComponent<ActionBarProps> = function ActionBar({
  actionItems,
  ...props
}) {
  return (
    <Container {...props}>
      {actionItems.map(({ title, onClick }, index: number) => (
        <ActionButton key={index} onClick={onClick}>
          {title}
        </ActionButton>
      ))}
    </Container>
  );
};
