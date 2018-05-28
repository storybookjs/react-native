import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import Textarea from 'react-textarea-autosize';

const StyledTextarea = styled(Textarea)({
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
});

class ObjectType extends Component {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.knob.value !== state.value) {
      try {
        return { value: JSON.stringify(props.knob.value, null, 2), failed: false };
      } catch (e) {
        return { value: 'Object cannot be stringified', failed: true };
      }
    }
    return null;
  }

  handleChange = e => {
    const { value } = e.target;

    try {
      const json = JSON.parse(e.target.value.trim());
      this.setState({
        value,
        failed: false,
      });
      this.props.onChange(json);
    } catch (err) {
      this.setState({
        value,
        failed: true,
      });
    }
  };

  render() {
    const { knob } = this.props;
    const { value, failed } = this.state;
    const extraStyle = {};

    if (failed) {
      extraStyle.border = '1px solid #fadddd';
      extraStyle.backgroundColor = '#fff5f5';
    }

    return (
      <StyledTextarea
        id={knob.name}
        style={extraStyle}
        value={value}
        onChange={this.handleChange}
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
