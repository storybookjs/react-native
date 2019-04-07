import React, { PureComponent } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import style from '../style';

export interface Props {
  id: string;
  title: string;
  onPress: (id: string) => void;
}

export default class Tab extends PureComponent<Props> {
  onPressHandler = () => {
    const { onPress, id } = this.props;
    onPress(id);
  };

  render() {
    const { title } = this.props;
    return (
      <TouchableOpacity style={style.tab} onPress={this.onPressHandler}>
        <Text style={style.text}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
