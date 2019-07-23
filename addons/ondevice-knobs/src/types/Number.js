import PropTypes from 'prop-types';
import React from 'react';
import { TextInput, View, Slider } from 'react-native';

class NumberType extends React.Component {
  constructor(props) {
    super(props);
    this.renderNormal = this.renderNormal.bind(this);
    this.renderRange = this.renderRange.bind(this);
  }

  numberTransformer = x => {
    if (Number.isNaN(Number(x))) {
      return x.substr(0, x.length - 1);
    }

    return x;
  };

  onChangeNormal = value => {
    const { onChange } = this.props;

    if (!Number.isNaN(value)) {
      onChange(value);
    }
  };

  renderNormal() {
    const { knob } = this.props;

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
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        value={(knob.value || '').toString()}
        transformer={this.numberTransformer}
        keyboardType="numeric"
        onChangeText={this.onChangeNormal}
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
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    range: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

NumberType.serialize = value => String(value);
NumberType.deserialize = value => parseFloat(value);

export default NumberType;
