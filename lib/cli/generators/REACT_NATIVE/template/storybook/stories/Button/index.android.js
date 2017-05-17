import React from 'react';
import { TouchableNativeFeedback } from 'react-native';

export default function Button(props) {
  return (
    <TouchableNativeFeedback onPress={props.onPress || Function()}>
      {props.children}
    </TouchableNativeFeedback>
  );
}
