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
        value={value}
        type="checkbox"
        onChange={() => onChange(this.refs.input.checked)}
      />
    );
  }
}

BooleanType.propTypes = {
  value: React.PropTypes.bool,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default BooleanType;
