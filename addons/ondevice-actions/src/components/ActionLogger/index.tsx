import React from 'react';
import { Button, View, Text, ScrollView } from 'react-native';
import { ActionDisplay } from '@storybook/addon-actions';
import Inspect from './Inspect';

interface ActionLoggerProps {
  actions: ActionDisplay[];
  onClear: () => void;
}

export const ActionLogger = ({ actions, onClear }: ActionLoggerProps) => (
  <ScrollView>
    <ScrollView horizontal>
      <View>
        {actions.map((action: ActionDisplay) => (
          <View key={action.id} style={{ flexDirection: 'row' }}>
            <View>{action.count > 1 ? <Text>{action.count}</Text> : null}</View>
            <View style={{ flexGrow: 1 }}>
              <Inspect name={action.data.name} value={action.data.args || action.data} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    <View>
      <Button onPress={onClear} title="CLEAR" />
    </View>
  </ScrollView>
);

export default ActionLogger;
