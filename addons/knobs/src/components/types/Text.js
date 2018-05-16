import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

import Textarea from 'react-textarea-autosize';
import debounce from 'lodash.debounce';

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

class TextType extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      value: props.knob.value,
    };

    this.onChange = debounce(props.onChange, 200);
  }

  handleChange = event => {
    const { value } = event.target;

    this.setState({ value });

    this.onChange(value);
  };

  render() {
    const { knob } = this.props;
    const { value } = this.state;

    return <StyledTextarea id={knob.name} value={value} onChange={this.handleChange} />;
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
