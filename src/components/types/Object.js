import React from 'react';
import Textarea from 'react-textarea-autosize';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
  fontFamily: 'monospace',
};

class ObjectType extends React.Component {
  handleChange(e) {
    const { onChange } = this.props;
    try {
      const value = JSON.parse(e.target.value.trim());
      onChange(value);
      this.failed = false;
    } catch (err) {
      this.failed = true;
      this.setState({ value: e.target.value });
    }
  }

  render() {
    const { knob } = this.props;
    let value = JSON.stringify(knob.value, null, 2);
    const extraStyle = {};

    if (this.failed) {
      value = this.state.value;
      extraStyle.border = '1px solid #fadddd';
      extraStyle.backgroundColor = '#fff5f5';
    }

    return (
      <Textarea
        id={knob.name}
        ref="input"
        style={{ ...styles, ...extraStyle }}
        value={value}
        onChange={e => this.handleChange(e)}
      />
    );
  }
}

ObjectType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

ObjectType.serialize = function (object) {
  return JSON.stringify(object);
};

ObjectType.deserialize = function (value) {
  if (!value) return {};
  return JSON.parse(value);
};

export default ObjectType;
