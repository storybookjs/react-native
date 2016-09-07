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

class TextType extends React.Component {
  render() {
    const { value, name, onChange } = this.props;

    return (
      <input
        id={name}
        ref="input"
        style={styles}
        value={value}
        onChange={() => onChange(this.refs.input.value)}
      />
    );
  }
}

TextType.propTypes = {
  value: React.PropTypes.string,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

export default TextType;
