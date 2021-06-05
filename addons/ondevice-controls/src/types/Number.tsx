import React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from '@emotion/native';

const Input = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  borderColor: theme.borderColor || '#e6e6e6',
  borderRadius: 2,
  fontSize: 13,
  padding: 5,
  color: theme.labelColor || 'black',
}));

interface NumberProps {
  knob: {
    name: string;
    value: any;
    step: number;
    min: number;
    max: number;
    range: boolean;
    defaultValue: number;
  };
  onChange: (value: any) => void;
}

class NumberType extends React.Component<NumberProps, { inputValue: any; showError: boolean }> {
  static defaultProps = {
    knob: {},
    onChange: (value) => value,
  };

  static serialize = (value) => String(value);

  static deserialize = (value) => parseFloat(value);

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
        value={inputValue.toString()}
        keyboardType="numeric"
        onChangeText={this.onChangeNormal}
        style={showError && { borderColor: '#FF4400' }}
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
        onSlidingComplete={(val) => onChange(val)}
      />
    );
  };

  render() {
    const { knob } = this.props;

    return (
      <View style={{ margin: 10 }}>{knob.range ? this.renderRange() : this.renderNormal()}</View>
    );
  }
}

export default NumberType;
