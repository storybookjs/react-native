import styled from '@emotion/native';
import { API } from '@storybook/api';
import React from 'react';
import { Linking, Text } from 'react-native';
import { useArgs } from './hooks';
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

  const isArgsStory = parameters.__isArgsStory;

  const hasControls = Object.values(argTypes).some((arg: ArgType) => arg?.control);
  const showWarning = !(hasControls && isArgsStory);
  const argsObject = hasControls
    ? Object.entries(argsfromHook).reduce((prev, [name, value]) => {
        return {
          ...prev,
          [name]: { ...argTypes?.[name], name, type: argTypes[name]?.control?.type, value },
        };
      }, {})
    : {};

  return (
    <>
      {showWarning && (
        <Text>
          This story is not configured to handle controls
          <Text
            onPress={() =>
              Linking.openURL('https://storybook.js.org/docs/react/essentials/controls')
            }
          >
            Learn how to add controls
          </Text>
        </Text>
      )}
      <PropForm args={argsObject} onFieldChange={updateArgs} />
      <Touchable onPress={() => resetArgs()}>
        <ResetButton>RESET</ResetButton>
      </Touchable>
    </>
  );
};

export default ControlsPanel;
