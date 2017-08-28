import React from 'react';
import glamorous from 'glamorous';

const Button = props => <span role="button" tabIndex={-1} {...props} />;

export default glamorous(Button, { displayName: 'Button', rootEl: 'span' })(
  {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      border: '1px solid #ccc',
    },
  },
  props => {
    const styles = [];

    if (props.highlight) {
      styles.push({
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        border: '1px solid #ccc',
      });
    }

    return styles;
  }
);
