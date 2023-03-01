import styled from '@emotion/native';
import { API } from '@storybook/api';
import React, { useState, useCallback } from 'react';
import { Args, StoryContext } from '@storybook/addons';

import { useArgs } from './hooks';
import NoControlsWarning from './NoControlsWarning';
import PropForm from './PropForm';

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

const ControlsPanel = ({ api }: { api: API }) => {
  const store = api.store();
  const storyId = store.getSelection().storyId;
  const [isPristine, setIsPristine] = useState(true);
  const [argsfromHook, updateArgs, resetArgs] = useArgs(storyId, store);
  const { argTypes, parameters } = store.fromId(storyId) as StoryContext;

  const argsObject = Object.entries(argTypes).reduce((prev, [key, argType]) => {
    const isControl = Boolean(argType?.control);

    return isControl
      ? {
          ...prev,
          [key]: { ...argType, name: key, type: argType?.control?.type, value: argsfromHook[key] },
        }
      : prev;
  }, {});
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

  const handleReset = () => {
    resetArgs();
    setIsPristine(true);
  };

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
