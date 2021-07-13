import { ActionDisplay } from '@storybook/addon-actions';
import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
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
          <View key={action.id} style={styles.row}>
            <View>{action.count > 1 ? <Text>{action.count}</Text> : null}</View>
            <View style={styles.grow}>
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

const styles = StyleSheet.create({
  grow: { flexGrow: 1 },
  row: { flexDirection: 'row' },
});
