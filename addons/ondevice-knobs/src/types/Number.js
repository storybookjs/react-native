import PropTypes from 'prop-types';
import React from 'react';
import { TextInput, View, Slider } from 'react-native';

class NumberType extends React.Component {
  constructor(props) {
    super(props);
    this.renderNormal = this.renderNormal.bind(this);
    this.renderRange = this.renderRange.bind(this);
  }

  renderNormal() {
    const { knob, onChange } = this.props;

    return (
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#f7f4f4',
          borderRadius: 2,
          fontSize: 13,
          padding: 5,
          color: '#555',
        }}
        underlineColorAndroid="transparent"
        value={knob.value.toString()}
        keyboardType="numeric"
        onChangeText={val => onChange(parseFloat(val))}
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
        onSlidingComplete={val => onChange(parseFloat(val))}
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
  onChange: value => value,
};

NumberType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }),
  onChange: PropTypes.func,
};

NumberType.serialize = value => String(value);
NumberType.deserialize = value => parseFloat(value);

export default NumberType;
