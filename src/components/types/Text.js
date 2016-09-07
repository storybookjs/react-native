import React from 'react';
import Textarea from 'react-textarea-autosize';

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
    const { knob, onChange } = this.props;

    return (
      <Textarea
        id={knob.name}
        ref="input"
        style={styles}
        value={knob.value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
}

TextType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

TextType.serialize = function(value) {
  return value;
};

TextType.deserialize = function(value) {
  return value;
};

export default TextType;
