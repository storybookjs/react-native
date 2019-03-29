import * as React from 'react';
import { useState, useCallback } from 'react';
import { useChannel } from '../libs/hooks';
import { ToolBar } from '../components/ToolBar';
import { INIT_WRAPPER, UPDATE_MANAGER, UPDATE_WRAPPER } from '../libs/constants';
import { TAddonManager } from '../libs/types';

/**
 * Control addon states and addon-story interactions
 */
export const AddonManager: TAddonManager = ({ channel }) => {
  const [nodes, setNodes] = useState([]);
  const [source, record] = useState({});

  // register channel-event handlers
  useChannel(
    UPDATE_MANAGER,
    (newNodes) => {
      setNodes(newNodes);
      channel.emit(INIT_WRAPPER, source);
    },
    [source]
  );

  // handler for caching and updating wrapper states
  const setSelect = useCallback((nodeId, name) => {
    channel.emit(UPDATE_WRAPPER, [nodeId, name]);
    record((state) => ({
      ...state,
      [nodeId]: name,
    }));
  }, []);

  return <ToolBar nodes={nodes} setSelect={setSelect} />;
};
