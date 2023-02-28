import PropTypes from 'prop-types';
import React from 'react';
import Slider from '@react-native-community/slider';
import { View } from 'react-native';
import styled from '@emotion/native';

import { inputStyle } from './common';

const Input = styled.TextInput(({ theme, showError }) => {
  const style = inputStyle(theme);
  return {
    ...style,
    borderColor: showError ? theme.inputs.errorTextColor : style.borderColor,
  };
});

class NumberType extends React.Component {
  constructor(props) {
    super(props);

    const { knob } = this.props;
    const initialInputValue = Number.isNaN(knob.value) ? '' : knob.value.toString();

    this.state = {
      inputValue: initialInputValue,
      showError: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { knob } = this.props;
    const { inputValue } = this.state;

    return nextProps.knob.value !== knob.value || nextState.inputValue !== inputValue;
  }

  onChangeNormal = (text) => {
    const { onChange } = this.props;
    const inputValue = text.trim().replace(/,/, '.');
    if (inputValue === '') {
      this.setState({ showError: false, inputValue });
      return;
    }

    const parsedValue = Number(inputValue);

    this.setState({ inputValue });

    if (!Number.isNaN(parsedValue)) {
      onChange(parsedValue);
      this.setState({ showError: false });
    } else {
      this.setState({ showError: true });
    }
  };

  renderNormal = () => {
    const { inputValue, showError } = this.state;
    return (
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        value={inputValue}
        keyboardType="numeric"
        onChangeText={this.onChangeNormal}
        showError={showError}
      />
    );
  };

  renderRange = () => {
    const { knob, onChange } = this.props;

    return (
      <Slider
        value={knob.value}
        minimumValue={knob.min}
        maximumValue={knob.max}
        step={knob.step}
        onSlidingComplete={(val) => onChange(parseFloat(val))}
      />
    );
  };

  render() {
    const { knob } = this.props;
    return <View>{knob.range ? this.renderRange() : this.renderNormal()}</View>;
  }
}

NumberType.defaultProps = {
  knob: {},
  onChange: (value) => value,
};

NumberType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    range: PropTypes.bool,
    defaultValue: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

NumberType.serialize = (value) => String(value);
NumberType.deserialize = (value) => parseFloat(value);

export default NumberType;
