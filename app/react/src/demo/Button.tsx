import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
  margin: 10,
};

const Button = ({
  children,
  onClick,
}: {
  children: React.ReactChildren;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}) => (
  <button onClick={onClick} style={styles} type="button">
    {children}
  </button>
);

Button.displayName = 'Button';
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};
Button.defaultProps = {
  onClick: () => {},
};

export default Button;
