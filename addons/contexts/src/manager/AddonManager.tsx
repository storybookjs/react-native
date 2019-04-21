import React, { useEffect, useState, useCallback } from 'react';
import { useChannel, Channel } from './libs/useChannel';
import { ToolBar } from './ToolBar';
import { REBOOT_MANAGER, UPDATE_MANAGER, UPDATE_PREVIEW } from '../constants';
import { SelectionState, FCNoChildren } from '../types';

/**
 * Control addon states and addon-story interactions
 */
type AddonManager = FCNoChildren<{
  channel: Channel;
}>;

export const AddonManager: AddonManager = ({ channel }) => {
  const [nodes, setNodes] = useState([]);
  const [state, setState] = useState<SelectionState>(undefined);
  const setSelected = useCallback(
    (nodeId, name) => setState((obj = {}) => ({ ...obj, [nodeId]: name })),
    []
  );

  // from preview
  useChannel(UPDATE_MANAGER, newNodes => setNodes(newNodes), []);
  useChannel(UPDATE_MANAGER, (_, newState) => newState && setState(newState), []);

  // to preview
  useEffect(() => channel.emit(REBOOT_MANAGER), []);
  useEffect(() => state && channel.emit(UPDATE_PREVIEW, state), [state]);

  return <ToolBar nodes={nodes} state={state || {}} setSelected={setSelected} />;
};
