import glamorous from 'glamorous';

export default glamorous.button(
  {
    border: '1px solid rgba(0, 0, 0, 0)',
    font: 'inherit',
    background: 'none',
    'box-shadow': 'none',
    padding: 0,
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
