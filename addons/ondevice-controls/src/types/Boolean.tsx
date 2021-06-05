import { View, Switch } from 'react-native';
import React from 'react';

export interface BooleanProps {
  onChange: (value: boolean) => void;
  knob: {
    name: string;
    value: boolean;
  };
}

class BooleanType extends React.Component<BooleanProps, {}> {
  static defaultProps = {
    knob: {},
    onChange: (value) => value,
  };

  static serialize = (value) => (value ? String(value) : null);

  static deserialize = (value) => value === 'true';

  onValueChange = () => {
    const { onChange, knob } = this.props;
    onChange(!knob.value);
  };

  render() {
    const { knob } = this.props;

    return (
      <View style={{ margin: 10, alignItems: 'flex-start' }}>
        <Switch testID={knob.name} onValueChange={this.onValueChange} value={knob.value} />
      </View>
    );
  }
}

export default BooleanType;
