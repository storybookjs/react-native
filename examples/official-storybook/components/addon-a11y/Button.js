import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  button: {
    padding: '12px 6px',
    fontSize: '12px',
    lineHeight: '16px',
    borderRadius: '5px',
  },
  ok: {
    backgroundColor: '#028402',
    color: '#ffffff',
  },
  wrong: {
    color: '#ffffff',
    backgroundColor: '#4caf50',
  },
};

function Button({ content, disabled, contrast }) {
  return (
    <button
      type="button"
      style={{
        ...styles.button,
        ...styles[contrast],
      }}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

Button.propTypes = {
  content: PropTypes.string,
  disabled: PropTypes.bool,
  contrast: PropTypes.oneOf(['ok', 'wrong']),
};

Button.defaultProps = {
  content: 'null',
  disabled: false,
  contrast: 'ok',
};

export default Button;
