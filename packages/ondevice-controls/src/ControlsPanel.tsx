import type { API } from '@storybook/core/manager-api';
import { Channel } from '@storybook/core/channels';
import type { Args, StoryContextForLoaders } from '@storybook/csf';
import { styled } from '@storybook/react-native-theming';
import type { Renderer } from '@storybook/core/types';
import React, { ComponentType, ReactElement, useCallback, useState } from 'react';
import NoControlsWarning from './NoControlsWarning';
import PropForm from './PropForm';
import { useArgs } from './hooks';

export interface Selection {
  storyId: string;
  viewMode: 'story';
}

const ButtonTouchable = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.button.secondary.backgroundColor,
  borderRadius: theme.button.secondary.borderRadius,
  borderWidth: theme.button.secondary.borderWidth,
  borderColor: theme.button.secondary.borderColor,
  paddingVertical: theme.button.paddingVertical,
  paddingHorizontal: theme.button.paddingHorizontal,
  justifyContent: 'center',
  alignItems: 'center',
}));

const ButtonText = styled.Text(({ theme }) => ({
  color: theme.button.secondary.textColor,
  fontSize: theme.button.fontSize,
  fontWeight: theme.button.fontWeight,
}));

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
export interface ArgType {
  name?: string;
  description?: string;
  defaultValue?: any;
  [key: string]: any;
}
export interface ArgTypes {
  [key: string]: ArgType;
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

  const { argsObject, argTypes, parameters } = React.useMemo(() => {
    const { argTypes: storyArgTypes, parameters: storyParameters } = store.fromId(storyId);

    const storyArgsObject = Object.entries(storyArgTypes).reduce(
      (prev, [key, argType]: [string, ArgType]) => {
        const isControl = Boolean(argType?.control);

        return isControl
          ? {
              ...prev,
              [key]: {
                ...argType,
                name: key,
                type: argType?.control?.type,
                value: argsFromHook[key],
              },
            }
          : prev;
      },
      {}
    );

    return {
      argTypes: storyArgTypes,
      parameters: storyParameters,
      argsObject: storyArgsObject,
    };
  }, [store, storyId, argsFromHook]);

  const hasControls = Object.keys(argTypes).length > 0;

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
    <>
      <PropForm args={argsObject} isPristine={isPristine} onFieldChange={updateArgsOnFieldChange} />

      <ButtonTouchable onPress={handleReset}>
        <ButtonText>RESET</ButtonText>
      </ButtonTouchable>
    </>
  );
};

export default ControlsPanel;
