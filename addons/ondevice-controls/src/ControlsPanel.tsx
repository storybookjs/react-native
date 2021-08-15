import styled from '@emotion/native';
import { API } from '@storybook/api';
import React from 'react';
import { useArgs } from './hooks';
import NoControlsWarning from './NoControlsWarning';
import PropForm from './PropForm';

const Touchable = styled.TouchableOpacity(({ theme }) => ({
  borderRadius: 2,
  borderWidth: 1,
  borderColor: theme.borderColor || '#e6e6e6',
  padding: 4,
  margin: 10,
  justifyContent: 'center',
  alignItems: 'center',
}));

const ResetButton = styled.Text(({ theme }) => ({
  color: theme.buttonTextColor || '#999999',
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
  const [argsfromHook, updateArgs, resetArgs] = useArgs(storyId, store);
  const { argTypes, parameters } = store.fromId(storyId);
  const argsObject = Object.entries(argsfromHook).reduce((prev, [name, value]) => {
    const isControl = Boolean(argTypes?.[name]?.control);

    return isControl
      ? {
          ...prev,
          [name]: { ...argTypes?.[name], name, type: argTypes[name]?.control?.type, value },
        }
      : prev;
  }, {});
  const hasControls = Object.keys(argsObject).length > 0;
  const isArgsStory = parameters.__isArgsStory;
  const showWarning = !(hasControls && isArgsStory);

  if (showWarning) {
    return <NoControlsWarning />;
  }

  return (
    <>
      <PropForm args={argsObject} onFieldChange={updateArgs} />
      <Touchable onPress={() => resetArgs()}>
        <ResetButton>RESET</ResetButton>
      </Touchable>
    </>
  );
};

export default ControlsPanel;
