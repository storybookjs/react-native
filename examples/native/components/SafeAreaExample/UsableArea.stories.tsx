import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react-native';
import { View, StyleSheet, Text } from 'react-native';

const UsableAreaMeta: ComponentMeta<any> = {
  title: 'Usable Area',
};
export default UsableAreaMeta;

type UsableAreaStory = ComponentStory<any>;

function UsableAreaContent() {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        borderWidth: 4,
        borderColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>This box should reach all corners of the content area.</Text>
    </View>
  );
}

export const SafeArea: UsableAreaStory = () => <UsableAreaContent />;
SafeArea.parameters = { noSafeArea: false };

export const NoSafeArea: UsableAreaStory = () => <UsableAreaContent />;
NoSafeArea.parameters = { noSafeArea: true };
