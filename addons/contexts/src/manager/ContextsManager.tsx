import React, { useEffect, useState, useCallback } from 'react';
import { useChannel } from '@storybook/api';
import { ToolBar } from './components/ToolBar';
import { deserialize, serialize } from '../shared/serializers';
import { PARAM, REBOOT_MANAGER, UPDATE_MANAGER, UPDATE_PREVIEW } from '../shared/constants';
import { FCNoChildren, ManagerAPI } from '../shared/types.d';

/**
 * A smart component for handling manager-preview interactions.
 */
type ContextsManager = FCNoChildren<{
  api: ManagerAPI;
}>;

export const ContextsManager: ContextsManager = ({ api }) => {
  const [nodes, setNodes] = useState([]);
  const [state, setState] = useState(deserialize(api.getQueryParam(PARAM)));
  const setSelected = useCallback(
    (nodeId, name) => setState(obj => ({ ...obj, [nodeId]: name })),
    []
  );

  // from preview
  const emit = useChannel({
    [UPDATE_MANAGER]: newNodes => setNodes(newNodes || []),
  });

  // to preview
  useEffect(() => emit(REBOOT_MANAGER), []);
  useEffect(() => emit(UPDATE_PREVIEW, state), [state]);
  useEffect(() => api.setQueryParams({ [PARAM]: serialize(state) }), [state]);

  return <ToolBar nodes={nodes} state={state || {}} setSelected={setSelected} />;
};
