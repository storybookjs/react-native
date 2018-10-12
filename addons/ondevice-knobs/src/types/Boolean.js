import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Switch } from 'react-native-switch';
import React from 'react';

class BooleanType extends React.Component {
  onValueChange = () => {
    const { onChange, knob } = this.props;
    onChange(!knob.value);
  };

  render() {
    const { knob } = this.props;

    return (
      <View style={{ margin: 10 }}>
        <Switch id={knob.name} onValueChange={this.onValueChange} value={knob.value} />
      </View>
    );
  }
}

BooleanType.defaultProps = {
  knob: {},
  onChange: value => value,
};

BooleanType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

BooleanType.serialize = value => (value ? String(value) : null);
BooleanType.deserialize = value => value === 'true';

export default BooleanType;
