import PropTypes from 'prop-types';
import { View, Switch } from 'react-native';
import React from 'react';

class BooleanType extends React.Component {
  onValueChange = () => {
    const { onChange, knob } = this.props;
    onChange(!knob.value);
  };

  render() {
    const { knob } = this.props;

    return <Switch id={knob.name} onValueChange={this.onValueChange} value={knob.value} />;
  }
}

BooleanType.defaultProps = {
  knob: {},
  onChange: (value) => value,
};

BooleanType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

BooleanType.serialize = (value) => (value ? String(value) : null);
BooleanType.deserialize = (value) => value === 'true';

export default BooleanType;
