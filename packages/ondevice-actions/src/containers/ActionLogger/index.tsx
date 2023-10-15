import React, { useState, useEffect, useMemo } from 'react';
import deepEqual from 'fast-deep-equal';
import { SELECT_STORY } from '@storybook/core-events';
import { ActionDisplay, EVENT_ID } from '@storybook/addon-actions';
import { ActionLogger as ActionLoggerComponent } from '../../components/ActionLogger';

import { Channel } from '@storybook/channels';
import { RNAddonApi } from '../..';

const safeDeepEqual = (a: any, b: any): boolean => {
  try {
    return deepEqual(a, b);
  } catch (e) {
    return false;
  }
};

interface ActionLoggerProps {
  active: boolean;
  api: RNAddonApi;
}

const ActionLogger = ({ active, api }: ActionLoggerProps) => {
  const channel: Channel = useMemo(() => {
    const store = api.store();
    return store._channel;
  }, [api]);

  const [actions, setActions] = useState<ActionDisplay[]>([]);
  const clearActions = () => setActions([]);
  const clearActionsOnStoryChange = actions.length > 0 && actions[0].options.clearOnStoryChange;

  useEffect(() => {
    const handleStoryChange = () => {
      if (clearActionsOnStoryChange) {
        clearActions();
      }
    };

    channel.addListener(SELECT_STORY, handleStoryChange);

    return () => {
      channel.removeListener(SELECT_STORY, handleStoryChange);
    };
  }, [clearActionsOnStoryChange, channel]);

  useEffect(() => {
    const addAction = (action: ActionDisplay) => {
      setActions((prevState: ActionDisplay[]) => {
        const newActions = [...prevState];
        const previous = newActions.length && newActions[0];
        if (previous && safeDeepEqual(previous.data, action.data)) {
          previous.count++;
        } else {
          action.count = 1;
          newActions.unshift(action);
        }
        return newActions.slice(0, action.options.limit);
      });
    };

    channel.addListener(EVENT_ID, addAction);

    return () => {
      channel.removeListener(EVENT_ID, addAction);
    };
  }, [channel]);

  return active ? <ActionLoggerComponent actions={actions} onClear={clearActions} /> : null;
};

export default ActionLogger;
