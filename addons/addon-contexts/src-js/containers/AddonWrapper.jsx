import React, {useEffect, useMemo, useReducer, useState} from 'react';
import { useChannel } from '../libs/hooks';
import { getNodes, renderAggregatedContexts } from '../libs/helpers';
import { propsTreeReducer, propsTreeUpdater } from '../libs/ducks';
import { INIT_WRAPPER, UPDATE_MANAGER, UPDATE_WRAPPER } from '../libs/constants';

/**
 * Wrap story under addon-injected contexts
 */
export const AddonWrapper = ({ channel, settings, children }) => {
  const nodes = useMemo(() => getNodes(settings), []);
  const [propsMap, dispatch] = useReducer(propsTreeReducer, {});
  const [ready, setReady] = useState(false);

  // register channel-event handlers
  const updatePropsMap = (tuple) => dispatch(propsTreeUpdater(nodes)(...tuple));
  useChannel(UPDATE_WRAPPER, updatePropsMap);
  useChannel(INIT_WRAPPER, (source) => {
    nodes
      .filter(({ nodeId }) => !(nodeId in source))
      .forEach(({ nodeId }) => updatePropsMap([nodeId]));
    Object.entries(source).forEach(updatePropsMap);
    setReady(true);
  });

  // push state to the manager (and wait to be initialized)
  useEffect(() => channel.emit(UPDATE_MANAGER, nodes), [null]);

  return renderAggregatedContexts(nodes, propsMap)(children(ready));
};
