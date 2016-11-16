import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  color: '#444',
  backgroundColor: 'white'
};

class ColorType extends React.Component {
  render() {
    const { knob, onChange } = this.props;

    return (
      <input
        id={knob.name}
        style={styles}
        value={knob.value}
        type="color"
        onChange={e => onChange(e.target.value)}
      />
    );
  }
}

ColorType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

ColorType.serialize = function (value) {
  return value;
};

ColorType.deserialize = function (value) {
  return value;
};

export default ColorType;
