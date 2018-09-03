import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Wrapper = styled.label(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  margin: '8px 0',
  borderBottom: theme.mainBorder,
  padding: '0 8px 8px 8px',

  '&:last-child': {
    borderBottom: '0 none',
    paddingBottom: 0,
  },
}));

const Label = styled.span({
  minWidth: 100,
  minHeight: 32,
  marginRight: 16,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  lineHeight: '16px',
});

const Field = ({ label, children }) => (
  <Wrapper>
    {label ? (
      <Label>
        <span>{label}</span>
      </Label>
    ) : null}
    {children}
  </Wrapper>
);
Field.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node.isRequired,
};
Field.defaultProps = {
  label: undefined,
};

export default Field;
