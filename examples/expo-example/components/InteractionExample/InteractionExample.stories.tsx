import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react-native';
import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';

export default {
  title: 'Interaction Example',
  parameters: {
    notes: `
Use these example to test that tapping the story view will dismiss the keyboard,
but won't interfere with scrolling or other touch interactions.
`,
  },
} as ComponentMeta<any>;

type InteractionExampleStory = ComponentStory<any>;

function ExampleItem({ children }) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 8,
        backgroundColor: '#dee2e3',
        marginBottom: 8,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#001a23' }}>{children}</Text>
    </View>
  );
}

function ExampleInput() {
  return (
    <TextInput
      style={{
        borderWidth: 1.25,
        borderColor: '#a3c1e0',
        marginBottom: 8,
        borderRadius: 8,
        height: 40,
        paddingHorizontal: 8,
      }}
      placeholder="Type something"
    />
  );
}

export const Static: InteractionExampleStory = () => (
  <>
    <ExampleInput />
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        Opening the keyboard and then tapping somewhere in a story view will dismiss the keyboard.
      </Text>
    </View>
  </>
);

export const Touchable: InteractionExampleStory = () => {
  const [count, increment] = React.useReducer((state) => state + 1, 0);
  return (
    <>
      <ExampleInput />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Pressed {count} time(s)</Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 8,
            padding: 8,
            marginVertical: 16,
            borderColor: '#b2cbe6',
            backgroundColor: '#dcebf9',
          }}
          onPress={() => increment()}
        >
          <Text>This button can be tapped without the story view interfering.</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export const Scrolling: InteractionExampleStory = () => (
  <>
    <ExampleInput />
    <ScrollView>
      <ExampleItem>This can scroll when the keyboard is closed.</ExampleItem>
      <ExampleItem>And also when the keyboard is open.</ExampleItem>
      {Array(25)
        .fill(true)
        .map((_ignored, idx) => (
          <ExampleItem key={idx}>Item #{idx}</ExampleItem>
        ))}
    </ScrollView>
  </>
);
