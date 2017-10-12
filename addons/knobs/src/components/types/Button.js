import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  height: '26px',
};

class ButtonType extends React.Component {
  render() {
    const { knob, onClick } = this.props;
    return (
      <button
        type="button"
        id={knob.name}
        ref={c => {
          this.input = c;
        }}
        style={styles}
        onClick={() => onClick(knob)}
      >
        {knob.name}
      </button>
    );
  }
}

ButtonType.defaultProps = {
  knob: {},
};

ButtonType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
};

ButtonType.serialize = value => value;
ButtonType.deserialize = value => value;

export default ButtonType;
