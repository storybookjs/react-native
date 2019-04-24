import React, { useEffect, useState, useCallback } from 'react';
import { useChannel } from './libs/useChannel';
import { ToolBar } from './components/ToolBar';
import { deserialize, serialize } from '../shared/serializers';
import { PARAM, REBOOT_MANAGER, UPDATE_MANAGER, UPDATE_PREVIEW } from '../shared/constants';
import { FCNoChildren, ManagerAPI, SelectionState } from '../shared/types';

/**
 * A smart component for handling manager-preview interactions
 */
type ContextsManager = FCNoChildren<{
  api: ManagerAPI;
}>;

export const ContextsManager: ContextsManager = ({ api }) => {
  const [nodes, setNodes] = useState([]);
  const [state, setState] = useState<SelectionState>(deserialize(api.getQueryParam(PARAM)));
  const setSelected = useCallback(
    (nodeId, name) => setState((obj = {}) => ({ ...obj, [nodeId]: name })),
    []
  );

  // from preview
  useChannel(UPDATE_MANAGER, newNodes => newNodes && setNodes(newNodes), []);
  useChannel(UPDATE_MANAGER, (_, newState) => newState && setState(newState), []);

  // to preview
  useEffect(() => api.emit(REBOOT_MANAGER), []);
  useEffect(() => api.emit(UPDATE_PREVIEW, state), [state]);
  useEffect(() => api.setQueryParams({ [PARAM]: serialize(state) }), [state]);

  return <ToolBar nodes={nodes} state={state || {}} setSelected={setSelected} />;
};
