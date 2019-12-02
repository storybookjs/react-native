import React, { FunctionComponent, HTMLAttributes } from 'react';

const styles = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
  margin: 10,
};

type Props = Pick<HTMLAttributes<HTMLButtonElement>, 'onClick'>;
const Button: FunctionComponent<Props> = ({ children, onClick }) => (
  <button onClick={onClick} style={styles} type="button">
    {children}
  </button>
);

Button.displayName = 'Button';
Button.defaultProps = {
  onClick: () => {},
};

export default Button;
