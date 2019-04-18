import React, { useEffect, useState, useCallback } from 'react';
import { useChannel } from './libs/useChannel';
import { ToolBar } from './ToolBar';
import { REBOOT_MANAGER, UPDATE_MANAGER, UPDATE_PREVIEW } from '../constants';
import { TAddonManager, StringObject } from '../@types';

/**
 * Control addon states and addon-story interactions
 */
export const AddonManager: TAddonManager = ({ channel }) => {
  const [nodes, setNodes] = useState([]);
  const [state, setState] = useState(undefined);
  const setSelected = useCallback(
    (nodeId, name) => setState((obj: StringObject = {}) => ({ ...obj, [nodeId]: name })),
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
