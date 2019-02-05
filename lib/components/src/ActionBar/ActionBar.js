import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

const Container = styled.div(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  maxWidth: '100%',
  display: 'flex',
  background: theme.barFill,
}));

export const ActionButton = styled.button(({ theme }) => ({
  border: '0 none',
  padding: '4px 10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',

  color: theme.color.dark,
  background: theme.barFill,

  fontSize: 12,
  lineHeight: '16px',
  fontWeight: theme.typography.weight.bold,

  borderTop: `1px solid ${theme.mainBorderColor}`,
  borderLeft: `1px solid ${theme.mainBorderColor}`,
  marginLeft: -1,

  borderRadius: `4px 0 0 0`,

  '&:not(:last-child)': { borderRight: `1px solid ${theme.mainBorderColor}` },
  '& + *': {
    borderLeft: `1px solid ${theme.mainBorderColor}`,
    borderRadius: 0,
  },

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 -3px 0 0 inset`,
    outline: '0 none',
  },
}));
ActionButton.displayName = 'ActionButton';

export const ActionBar = ({ actionItems }) => (
  <Container>
    {actionItems.map(({ title, onClick }, index) => (
      <ActionButton
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        onClick={onClick}
      >
        {title}
      </ActionButton>
    ))}
  </Container>
);

ActionBar.propTypes = {
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
};
