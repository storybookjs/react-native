import PropTypes from 'prop-types';
import React from 'react';

import { Form } from '@storybook/components';

class TextType extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { knob } = this.props;

    return nextProps.knob.value !== knob.value;
  }

  handleChange = event => {
    const { onChange } = this.props;
    const { value } = event.target;

    onChange(value);
  };

  render() {
    const { knob } = this.props;

    return (
      <Form.Textarea
        id={knob.name}
        name={knob.name}
        value={knob.value}
        onChange={this.handleChange}
        size="flex"
      />
    );
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
