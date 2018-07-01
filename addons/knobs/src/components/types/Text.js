import PropTypes from 'prop-types';
import React from 'react';

import { Textarea } from '@storybook/components';

class TextType extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.knob.value !== state.value) {
      return { value: props.knob.value };
    }
    return null;
  }

  handleChange = event => {
    const { value } = event.target;

    this.setState({ value });

    this.props.onChange(value);
  };

  render() {
    const { knob } = this.props;
    const { value } = this.state;

    return <Textarea id={knob.name} value={value} onChange={this.handleChange} size="flex" />;
  }
}

TextType.defaultProps = {
  knob: {},
  onChange: value => value,
};

TextType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

TextType.serialize = value => value;
TextType.deserialize = value => value;

export default TextType;
