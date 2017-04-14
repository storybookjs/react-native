import React from 'react';
import { TouchableHighlight } from 'react-native';

export default function Button(props) {
  return (
    <TouchableHighlight onPress={props.onPress || Function()}>
      {props.children}
    </TouchableHighlight>
  );
}
