import React from 'react';
import { View } from 'react-native';
import style from './style';

export default function CenterView(props) {
  return (
    <View style={style.main}>
      {props.children}
    </View>
  );
}
