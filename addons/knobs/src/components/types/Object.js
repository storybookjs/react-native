import PropTypes from 'prop-types';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import deepEqual from 'deep-equal';

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
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  getJSONString() {
    const { json, jsonString } = this.state;
    const { knob } = this.props;

    // If there is an error in the JSON, we need to give that errored JSON.
    if (this.failed) return jsonString;

    // If the editor value and the knob value is the same, we need to return the
    // editor value as it allow user to add new fields to the JSON.
    if (deepEqual(json, knob.value)) return jsonString;

    // If the knob's value is different from the editor, it seems like
    // there's a outside change and we need to get that.
    return JSON.stringify(knob.value, null, 2);
  }

  handleChange(e) {
    const { onChange } = this.props;
    const newState = {
      jsonString: e.target.value,
    };

    try {
      newState.json = JSON.parse(e.target.value.trim());
      onChange(newState.json);
      this.failed = false;
    } catch (err) {
      this.failed = true;
    }

    this.setState(newState);
  }

  render() {
    const { knob } = this.props;
    const jsonString = this.getJSONString();
    const extraStyle = {};

    if (this.failed) {
      extraStyle.border = '1px solid #fadddd';
      extraStyle.backgroundColor = '#fff5f5';
    }

    return (
      <Textarea
        id={knob.name}
        style={{ ...styles, ...extraStyle }}
        value={jsonString}
        onChange={e => this.handleChange(e)}
      />
    );
  }
}

ObjectType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ObjectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }),
  onChange: PropTypes.func,
};

ObjectType.serialize = object => JSON.stringify(object);
ObjectType.deserialize = value => (value ? JSON.parse(value) : {});

export default ObjectType;
