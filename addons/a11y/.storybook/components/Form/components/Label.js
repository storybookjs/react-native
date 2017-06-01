import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  label: {
    padding: '0 6px',
  },
}

function Label({ id, content }) {
  return (
    <label
      style={styles.label}
      htmlFor={id}
    >
      { content }
    </label>
  )
}

Label.propTypes = {
  content: PropTypes.string,
  id: PropTypes.string,
};

export default Label;
