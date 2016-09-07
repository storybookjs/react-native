import React from 'react';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #ececec',
  fontSize: '12px',
  padding: '5px',
  color: 'rgb(130, 130, 130)',
};

class BooleanType extends React.Component {
  render() {
    const { value, name, onChange } = this.props;
    
    return (
      <input
        id={name}
        ref="input"
        style={styles}
        type="checkbox"
        onChange={() => onChange(this.refs.input.checked)}
        checked={value}
      />
    );
  }
}

BooleanType.propTypes = {
  value: React.PropTypes.bool,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

BooleanType.serialize = function(value) {
  return String(value);
};

BooleanType.deserialize = function(value) {
  return value.trim() === 'true';
};

export default BooleanType;
