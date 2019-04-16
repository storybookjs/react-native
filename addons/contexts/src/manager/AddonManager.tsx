import React, { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { useChannel } from './libs/useChannel';
import { ToolBar } from './ToolBar';
import { UPDATE_MANAGER, UPDATE_PREVIEW } from '../constants';
import { TAddonManager } from '../@types';

/**
 * Control addon states and addon-story interactions
 */
export const AddonManager: TAddonManager = ({ channel }) => {
  const [nodes, setNodes] = useState([]);
  const [state, setState] = useState({});
  const setSelected = useCallback(
    (nodeId, name) => setState((state) => ({ ...state, [nodeId]: name })),
    []
  );

  // from preview
  useChannel(UPDATE_MANAGER, (newNodes) => setNodes(newNodes), []);

  // to preview
  useEffect(() => channel.emit(UPDATE_PREVIEW, state), [state]);

  return <ToolBar nodes={nodes} state={state} setSelected={setSelected} />;
};
