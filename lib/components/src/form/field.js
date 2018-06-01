import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

const Wrapper = styled('label')({
  width: '100%',
  display: 'flex',
  marginBottom: 16,
});

const Label = styled('span')({
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
