import { useSyncExternalStore } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@storybook/react-native-theming';
import { FORCE_REMOUNT } from 'storybook/internal/core-events';
import type { Call, LogItem } from 'storybook/internal/instrumenter';
import { addons } from 'storybook/manager-api';
import { formatCall } from './format';
import type { InteractionsState, InteractionsStore } from './store';

type Status = 'pass' | 'fail' | 'runs' | 'idle';

// The render phases during which a remount would have to interrupt the story.
const PENDING_PHASES = ['preparing', 'loading', 'beforeEach', 'rendering', 'playing', 'afterEach'];

const STATUS_ICONS: Record<NonNullable<LogItem['status']>, string> = {
  done: '✓',
  error: '✗',
  active: '●',
  waiting: '○',
};

function getStatus({ renderPhase, logItems }: InteractionsState): Status {
  if (renderPhase === 'errored' || logItems.some((i) => i.status === 'error')) {
    return 'fail';
  }
  if (renderPhase === 'playing') {
    return 'runs';
  }
  if (logItems.length > 0) {
    return 'pass';
  }
  return 'idle';
}

export const InteractionsPanel = ({
  active,
  store,
}: {
  active: boolean;
  store: InteractionsStore;
}) => {
  const theme = useTheme();
  const state = useSyncExternalStore(store.subscribe, store.getState);
  const { storyId, renderPhase, calls, logItems } = state;
  const status = getStatus(state);
  // Only offer a rerun once the current run has finished.
  const canRerun = Boolean(storyId) && !PENDING_PHASES.includes(renderPhase ?? '');

  if (!active) {
    return null;
  }

  const statusColor = {
    pass: theme.color.positive,
    fail: theme.color.negative,
    runs: theme.color.secondary,
    idle: theme.color.mediumdark,
  }[status];

  return (
    <View style={styles.container}>
      <View style={[styles.toolbar, { borderColor: theme.appBorderColor }]}>
        <Text testID="interactions-status" style={[styles.badge, { backgroundColor: statusColor }]}>
          {status.toUpperCase()}
        </Text>
        <Text style={[styles.count, { color: theme.color.defaultText }]}>
          {logItems.length} interactions
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Rerun"
          disabled={!canRerun}
          onPress={() => addons.getChannel().emit(FORCE_REMOUNT, { storyId })}
          style={[styles.control, !canRerun && styles.disabled]}
        >
          <Text style={[styles.controlIcon, { color: theme.color.secondary }]}>↻</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {logItems.length === 0 ? (
          <Text style={{ color: theme.color.mediumdark }}>
            No interactions. Calls to `expect` and `step` in the story&apos;s play function show up
            here.
          </Text>
        ) : null}
        {logItems.map((item) => (
          <CallRow key={item.callId} item={item} call={calls[item.callId]} calls={calls} />
        ))}
      </ScrollView>
    </View>
  );
};

const CallRow = ({
  item,
  call,
  calls,
}: {
  item: LogItem;
  call?: Call;
  calls: Record<string, Call>;
}) => {
  const theme = useTheme();
  if (!call) {
    return null;
  }
  const status = item.status ?? 'waiting';
  const iconColor = {
    done: theme.color.positive,
    error: theme.color.negative,
    active: theme.color.secondary,
    waiting: theme.color.mediumdark,
  }[status];
  const { exception } = call;

  return (
    <View
      testID={`interaction-${status}`}
      style={[
        styles.row,
        { borderColor: theme.appBorderColor },
        { paddingLeft: 8 + item.ancestors.length * 16 },
        status === 'error' && { backgroundColor: theme.background.negative },
      ]}
    >
      <View style={styles.rowLine}>
        <Text style={[styles.icon, { color: iconColor }]}>{STATUS_ICONS[status]}</Text>
        <Text
          style={[
            styles.call,
            { color: theme.color.defaultText },
            call.method === 'step' && styles.step,
            status === 'waiting' && styles.waiting,
          ]}
        >
          {formatCall(call, calls)}
        </Text>
      </View>
      {status === 'error' && exception ? (
        <Text style={[styles.exception, { color: theme.color.negative }]}>{exception.message}</Text>
      ) : null}
    </View>
  );
};

const monospace = Platform.select({ ios: 'Menlo', default: 'monospace' });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  badge: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  count: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
  },
  control: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  controlIcon: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.3,
  },
  list: {
    paddingBottom: 16,
  },
  row: {
    paddingVertical: 8,
    paddingRight: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLine: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    width: 14,
    fontWeight: '700',
  },
  call: {
    flex: 1,
    fontFamily: monospace,
    fontSize: 12,
  },
  step: {
    fontFamily: undefined,
    fontWeight: '600',
    fontSize: 13,
  },
  waiting: {
    opacity: 0.5,
  },
  exception: {
    marginTop: 4,
    marginLeft: 22,
    fontFamily: monospace,
    fontSize: 11,
  },
});
