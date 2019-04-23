import React, { useEffect, useState, useCallback } from 'react';
import { useChannel } from './libs/useChannel';
import { ToolBar } from './ToolBar';
import { PARAM, REBOOT_MANAGER, UPDATE_MANAGER, UPDATE_PREVIEW } from '../constants';
import { SelectionState, FCNoChildren } from '../types';
import { deserialize, serialize } from './libs/processQueryParam';

/**
 * Control addon states and addon-story interactions
 */
type AddonManager = FCNoChildren<{
  api: any;
}>;

export const AddonManager: AddonManager = ({ api }) => {
  const [nodes, setNodes] = useState([]);
  const [state, setState] = useState<SelectionState>(deserialize(api.getQueryParam(PARAM)));
  const setSelected = useCallback(
    (nodeId, name) => setState((obj = {}) => ({ ...obj, [nodeId]: name })),
    []
  );

  // from preview
  useChannel(UPDATE_MANAGER, newNodes => setNodes(newNodes), []);
  useChannel(UPDATE_MANAGER, (_, newState) => newState && setState(newState), []);

  // to preview
  useEffect(() => api.emit(REBOOT_MANAGER), []);
  useEffect(() => state && api.emit(UPDATE_PREVIEW, state), [state]);

  // routing state
  useEffect(() => api.setQueryParam({ [PARAM]: serialize(state) }), [state]);

  return <ToolBar nodes={nodes} state={state || {}} setSelected={setSelected} />;
};
