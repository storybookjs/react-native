import React, { useEffect, useSyncExternalStore } from 'react';
import { ActionLogger as ActionLoggerComponent } from '../../components/ActionLogger';
import { actionStore } from './actionStore';

interface ActionLoggerProps {
  active?: boolean;
}

const ActionLogger = ({ active }: ActionLoggerProps) => {
  const actions = useSyncExternalStore(actionStore.subscribe, actionStore.getSnapshot);

  // Re-binds the listeners if the channel has been replaced since registration.
  useEffect(() => actionStore.listen(), []);

  return active ? <ActionLoggerComponent actions={actions} onClear={actionStore.clear} /> : null;
};

export default ActionLogger;
