import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  height: '26px',
};

class ButtonType extends React.Component {
  render() {
    const { knob, onChange } = this.props;
    return (
      <button
        type="button"
        id={knob.name}
        ref={c => {
          this.input = c;
        }}
        style={styles}
        onClick={() => onChange('clicked')}
      >
        {knob.name}
      </button>
    );
  }
}

ButtonType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ButtonType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

ButtonType.serialize = value => value;
ButtonType.deserialize = value => value;

export default ButtonType;
