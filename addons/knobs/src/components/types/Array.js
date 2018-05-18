import PropTypes from 'prop-types';
import React from 'react';
import Textarea from 'react-textarea-autosize';

import debounce from 'lodash.debounce';

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
  padding: '5px',
  color: '#555',
};

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

class ArrayType extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: props.knob.value.join(props.knob.separator),
    };

    this.onChange = debounce(this.props.onChange, 200);
  }

  componentWillUnmount() {
    this.onChange.cancel();
  }

  handleChange = e => {
    const { knob } = this.props;
    const { value } = e.target;
    const newVal = formatArray(value, knob.separator);

    this.setState({ value });
    this.onChange(newVal);
  };

  render() {
    const { knob } = this.props;
    const { value } = this.state;

    return <Textarea id={knob.name} style={styles} value={value} onChange={this.handleChange} />;
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
