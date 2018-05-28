import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import Textarea from 'react-textarea-autosize';

const StyledTextarea = styled(Textarea)({
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  maxWidth: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
});

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

class ArrayType extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.knob.value !== state.value) {
      return { value: props.knob.value };
    }
    return null;
  }

  componentWillUnmount() {
    this.onChange.cancel();
  }

  handleChange = e => {
    const { knob } = this.props;
    const { value } = e.target;
    const newVal = formatArray(value, knob.separator);

    this.setState({ value });
    this.props.onChange(newVal);
  };

  render() {
    const { knob } = this.props;
    const { value } = this.state;

    return <StyledTextarea id={knob.name} value={value} onChange={this.handleChange} />;
  }
}

ArrayType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ArrayType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.array,
    separator: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

ArrayType.serialize = value => value;
ArrayType.deserialize = value => {
  if (Array.isArray(value)) return value;

  return Object.keys(value)
    .sort()
    .reduce((array, key) => [...array, value[key]], []);
};

export default ArrayType;
