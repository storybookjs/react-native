import type { API } from 'storybook/manager-api';
import { Channel } from 'storybook/internal/channels';
import type { Args, StoryContextForLoaders } from 'storybook/internal/csf';
import type { Renderer } from 'storybook/internal/types';
import React, { ComponentType, ReactElement, useCallback, useState } from 'react';
import NoControlsWarning from './NoControlsWarning';
import PropForm from './PropForm';
import { getControlArgTypes } from './controlArgTypes';
import { useArgs } from './hooks';

export type { ArgType, ArgTypes } from './controlArgTypes';

export interface Selection {
  storyId: string;
  viewMode: 'story';
}

export declare type SortType = 'alpha' | 'requiredFirst' | 'none';
export declare type ColorValue = string;
export declare type PresetColor =
  | ColorValue
  | {
      color: ColorValue;
      title?: string;
    };
export interface ControlsParameters {
  sort?: SortType;
  expanded?: boolean;
  presetColors?: PresetColor[];
  hideNoControlsWarning?: boolean;
}
export interface ReactNativeFramework extends Renderer {
  component: ComponentType<any>;
  storyResult: ReactElement<unknown>;
}

type ApiStore = {
  fromId: (id: any) => Omit<StoryContextForLoaders<ReactNativeFramework, Args>, 'viewMode'>;
  getSelection: () => Selection;
  _channel: Channel;
};

const ControlsPanel = ({ api }: { api: API }) => {
  const store: ApiStore = api.store();

  const storyId = store.getSelection()?.storyId;

  const [isPristine, setIsPristine] = useState(true);

  const [argsFromHook, updateArgs, resetArgs] = useArgs(storyId, store);

  const { argsObject, parameters } = React.useMemo(() => {
    const { argTypes, parameters: storyParameters } = store.fromId(storyId);

    return {
      parameters: storyParameters,
      argsObject: getControlArgTypes(argTypes, argsFromHook),
    };
  }, [store, storyId, argsFromHook]);

  // Match the web Controls panel: an arg only counts once its control is enabled (not `control:
  // false`, `control.disable` or `table.disable`) and its `if` condition passes, so a story whose
  // controls are all hidden shows the warning instead of an empty table.
  const hasControls = Object.keys(argsObject).length > 0;

  const isArgsStory = parameters.__isArgsStory;

  const showWarning = !(hasControls && isArgsStory);

  const updateArgsOnFieldChange = useCallback(
    (args: Args) => {
      updateArgs(args);

      setIsPristine(false);
    },
    [updateArgs]
  );

  const handleReset = useCallback(() => {
    resetArgs();

    setIsPristine(true);
  }, [resetArgs]);

  if (showWarning) {
    return <NoControlsWarning />;
  }

  return (
    <PropForm
      args={argsObject}
      isPristine={isPristine}
      onFieldChange={updateArgsOnFieldChange}
      onReset={handleReset}
    />
  );
};

export default ControlsPanel;
