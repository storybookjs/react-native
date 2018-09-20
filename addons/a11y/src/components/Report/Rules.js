import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { Icons } from '@storybook/components';

const impactColors = {
  minor: '#f1c40f',
  moderate: '#e67e22',
  serious: '#e74c3c',
  critical: '#c0392b',
  success: '#2ecc71',
};

const List = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '4px',
  fontWeight: '400',
});

const Item = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '6px',
});

const Message = styled.div({
  paddingLeft: '6px',
});

const Status = styled.div(({ passes, impact }) => ({
  height: '16px',
  width: '16px',
  borderRadius: '8px',
  fontSize: '10px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  flex: '0 0 16px',
  color: passes ? impactColors.success : impactColors[impact],
}));

const Rule = ({ rule, passes }) => (
  <Item>
    <Status passes={passes || undefined} impact={rule.impact}>
      {passes ? <Icons icon="check" /> : <Icons icon="cross" />}
    </Status>
    <Message>{rule.message}</Message>
  </Item>
);

Rule.propTypes = {
  rule: PropTypes.shape({
    message: PropTypes.node,
  }).isRequired,
  passes: PropTypes.bool.isRequired,
};

/* eslint-disable react/no-array-index-key */
function Rules({ rules, passes }) {
  return (
    <List>
      {rules.map((rule, index) => (
        <Rule passes={passes} rule={rule} key={index} />
      ))}
    </List>
  );
}
Rules.propTypes = {
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.node,
    })
  ).isRequired,
  passes: PropTypes.bool.isRequired,
};

export default Rules;
