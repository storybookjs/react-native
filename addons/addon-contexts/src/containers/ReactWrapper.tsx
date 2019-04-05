import React from 'react';
import { useEffect, useReducer, useState } from 'react';
import { useChannel } from '../libs/hooks';
import { renderAggregatedContexts } from '../libs/helpers';
import { propsTreeReducer, propsTreeUpdater } from '../libs/ducks';
import { INIT_WRAPPER, UPDATE_MANAGER, UPDATE_WRAPPER } from '../libs/constants';
import { TAddonWrapper, StringObject, StringTuple } from '../@types';

/**
 * Wrap story under addon-injected contexts
 */
export const ReactWrapper: TAddonWrapper = ({ channel, nodes, children }) => {
  const [propsMap, dispatch] = useReducer(propsTreeReducer, {});
  const [ready, setReady] = useState(false);

  // register channel-event handlers
  const updatePropsMap = (tuple: StringTuple) => dispatch(propsTreeUpdater(nodes)(tuple));
  useChannel(UPDATE_WRAPPER, updatePropsMap);
  useChannel(INIT_WRAPPER, (source: StringObject) => {
    nodes
      .filter(({ nodeId }) => !(nodeId in source))
      .forEach(({ nodeId }) => updatePropsMap([nodeId, '']));
    Object.entries(source).forEach(updatePropsMap);
    setReady(true);
  });

  // push state to the manager (and wait to be initialized)
  useEffect(() => channel.emit(UPDATE_MANAGER, nodes), []);

  return renderAggregatedContexts(nodes, propsMap)(children(ready));
};
