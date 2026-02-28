import { ActionDisplay } from 'storybook/actions';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { styled } from '@storybook/react-native-theming';
import Inspect from './Inspect';

const CountText = styled.Text(({ theme }) => ({
  color: theme.color.defaultText,
}));

interface ActionLoggerProps {
  actions: ActionDisplay[];
  onClear: () => void;
}

export const ActionLogger = ({ actions, onClear }: ActionLoggerProps) => (
  <ScrollView contentContainerStyle={{ padding: 10 }}>
    <ScrollView horizontal>
      <View>
        {actions.map((action: ActionDisplay) => (
          <View key={action.id} style={styles.row}>
            <View>{action.count > 1 ? <CountText>{action.count}</CountText> : null}</View>
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
