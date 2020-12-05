import PropTypes from 'prop-types';
import React from 'react';
import { View, Slider } from 'react-native';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.borderColor,
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  color: theme.labelColor,
}));

class NumberType extends React.Component {
  constructor(props) {
    super(props);
    this.renderNormal = this.renderNormal.bind(this);
    this.renderRange = this.renderRange.bind(this);

    const { knob } = this.props;
    const initialInputValue = Number.isNaN(knob.value) ? '' : knob.value.toString();
    this.lastInputValue = initialInputValue;
    this.state = {
      inputValue: initialInputValue,
    };
  }

  componentDidUpdate() {
    const { onChange } = this.props;
    const { inputValue } = this.state;

    if (this.lastInputValue !== inputValue) {
      const inputValueEmpty = inputValue.trim() === '';
      const parsedInputValue = inputValueEmpty ? NaN : Number(inputValue);

      if (!Number.isNaN(parsedInputValue) || inputValueEmpty) {
        onChange(parsedInputValue);
        this.lastInputValue = inputValue;
      }
    }
  }

  onChangeNormal = (value) => {
    this.setState({
      inputValue: value.replace(/,(?=\d+$)/, '.'),
    });
  };

  renderNormal() {
    const { knob } = this.props;
    const { inputValue } = this.state;
    const showError =
      inputValue.trim() !== '' &&
      (Number(inputValue).toString() !== knob.value.toString() || Number.isNaN(knob.value));

    return (
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        value={inputValue}
        keyboardType="numeric"
        onChangeText={this.onChangeNormal}
        style={showError && { borderColor: '#FF4400' }}
      />
    );
  }

  renderRange() {
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
  }

  render() {
    const { knob } = this.props;

    return (
      <View style={{ margin: 10 }}>{knob.range ? this.renderRange() : this.renderNormal()}</View>
    );
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
  }),
  onChange: PropTypes.func,
};

NumberType.serialize = (value) => String(value);
NumberType.deserialize = (value) => parseFloat(value);

export default NumberType;
