import styled from '@emotion/native';
import React, { useState, useEffect, useCallback } from 'react';
import { Linking, Text } from 'react-native';
// import { PARAM_KEY } from './index';
import PropForm from './PropForm';
// import { useArgs, useParameter } from './hooks';
import { Channel } from '@storybook/addons';
import { API } from '@storybook/api';
import { SET_CURRENT_STORY } from '@storybook/core-events';

// const getTimestamp = () => +new Date();

// const DEFAULT_GROUP_ID = 'Other';

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

const ControlsPanel = ({
  api,
  active,
  channel,
}: {
  channel: Channel;
  api: API;
  active: boolean;
}) => {
  const [story, setStory] = useState<any>();

  const getStory = useCallback(() => {
    const sel = api.store().getSelection();
    setStory(api.store().fromId(sel.storyId));
  }, [api]);

  const reset = () => {
    api.store().resetStoryArgs(story.id);
  };

  useEffect(() => {
    if (active) {
      getStory();
    }
    channel.on(SET_CURRENT_STORY, getStory);
    return channel.off(SET_CURRENT_STORY, getStory);
  }, [api, active, channel, getStory]);
  if (!active || !story) {
    return null;
  }

  const params = story.parameters;

  const argTypes = params.argTypes;
  const isArgsStory = params.__isArgsStory;

  const updateArg = ({ name, value }) => {
    story.parameters.args[name] = value;
    api.store().updateStoryArgs(story.id, story.parameters.args);
  };

  const hasControls = Object.values(argTypes).some((arg: ArgType) => arg?.control);
  const showWarning = !(hasControls && isArgsStory);
  const args = Object.entries(story.parameters.args).reduce((prev, [name, value]) => {
    return {
      ...prev,
      [name]: { name, type: argTypes[name].control.type, value },
    };
  }, {});

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
      <PropForm args={args} onFieldChange={updateArg} />
      <Touchable onPress={reset}>
        <ResetButton>RESET</ResetButton>
      </Touchable>
      {/* <ArgsTable
        {...{
          key: path, // resets state when switching stories
          compact: !expanded && hasControls,
          rows: withPresetColors,
          args,
          updateArgs,
          resetArgs,
          inAddonPanel: true,
          sort,
        }}
      /> */}
    </>
  );
};

export default ControlsPanel;

// export default class Panel extends React.Component<
//   PanelProps,
//   { knobs: Record<string, Knob>; groupId: string }
// > {
//   constructor(props) {
//     super(props);
//     this.handleChange = this.handleChange.bind(this);
//     this.handlePress = this.handlePress.bind(this);
//     this.setKnobs = this.setKnobs.bind(this);
//     this.reset = this.reset.bind(this);
//     this.setOptions = this.setOptions.bind(this);
//     this.onGroupSelect = this.onGroupSelect.bind(this);

//     this.state = { knobs: {}, groupId: DEFAULT_GROUP_ID };
//     this.options = {};

//     this.lastEdit = getTimestamp();
//     this.loadedFromUrl = false;
//   }

//   options: any;

//   lastEdit: number;

//   loadedFromUrl: boolean;

//   componentDidMount() {
//     const { channel } = this.props;

//     channel.on(SET, this.setKnobs);
//     channel.on(SET_OPTIONS, this.setOptions);
//     channel.on(SELECT_STORY, this.selectStory);
//     channel.emit(FORCE_RE_RENDER);
//   }

//   componentWillUnmount() {
//     const { channel } = this.props;
//     channel.removeListener(SET, this.setKnobs);
//     channel.removeListener(SELECT_STORY, this.selectStory);
//   }

//   onGroupSelect(name) {
//     this.setState({ groupId: name });
//   }

//   setOptions(options = { timestamps: false }) {
//     this.options = options;
//   }

//   setKnobs({ knobs, timestamp }) {
//     if (!this.options.timestamps || !timestamp || this.lastEdit <= timestamp) {
//       this.setState({ knobs });
//     }
//   }

//   reset = () => {
//     const { channel } = this.props;
//     this.setState({ knobs: {} });
//     channel.emit(RESET);
//   };

//   selectStory = () => {
//     const { channel } = this.props;
//     this.setState({ knobs: {}, groupId: DEFAULT_GROUP_ID });
//     channel.emit(RESET);
//   };

//   emitChange(changedKnob) {
//     const { channel } = this.props;
//     channel.emit(CHANGE, changedKnob);
//   }

//   handleChange(changedKnob) {
//     this.lastEdit = getTimestamp();
//     const { knobs } = this.state;
//     const { name } = changedKnob;
//     const newKnobs = { ...knobs };
//     newKnobs[name] = {
//       ...newKnobs[name],
//       ...changedKnob,
//     };

//     this.setState({ knobs: newKnobs });

//     this.setState({ knobs: newKnobs }, () =>
//       this.emitChange(
//         changedKnob.type === 'number'
//           ? { ...changedKnob, value: parseFloat(changedKnob.value) }
//           : changedKnob
//       )
//     );
//   }

//   handlePress(knob) {
//     const { channel } = this.props;

//     channel.emit(CLICK, knob);
//   }

//   render() {
//     const { active } = this.props;

//     if (!active) {
//       return null;
//     }

//     const { knobs, groupId: stateGroupId } = this.state;

//     const groups = {};
//     const groupIds = [];

//     let knobsKeys = Object.keys(knobs);

//     const knobsWithGroups = knobsKeys.filter((key) => knobs[key].groupId);

//     knobsWithGroups.forEach((key) => {
//       const knobKeyGroupId = knobs[key].groupId;
//       groupIds.push(knobKeyGroupId);
//       groups[knobKeyGroupId] = {
//         render: () => <Text testID={knobKeyGroupId}>{knobKeyGroupId}</Text>,
//         title: knobKeyGroupId,
//       };
//     });

//     const allHaveGroups = groupIds.length > 0 && knobsKeys.length === knobsWithGroups.length;

//     // If all of the knobs are assigned to a group, we don't need the default group.
//     const groupId =
//       stateGroupId === DEFAULT_GROUP_ID && allHaveGroups
//         ? knobs[knobsWithGroups[0]].groupId
//         : stateGroupId;

//     if (groupIds.length > 0) {
//       if (!allHaveGroups) {
//         groups[DEFAULT_GROUP_ID] = {
//           render: () => <Text testID={DEFAULT_GROUP_ID}>{DEFAULT_GROUP_ID}</Text>,
//           title: DEFAULT_GROUP_ID,
//         };
//       }

//       if (groupId === DEFAULT_GROUP_ID) {
//         knobsKeys = knobsKeys.filter((key) => !knobs[key].groupId);
//       }

//       if (groupId !== DEFAULT_GROUP_ID) {
//         knobsKeys = knobsKeys.filter((key) => knobs[key].groupId === groupId);
//       }
//     }

//     const knobsArray = knobsKeys.map((key) => knobs[key]);

//     if (knobsArray.length === 0) {
//       return <Text>NO KNOBS</Text>;
//     }

//     return (
//       <View style={{ flex: 1, paddingTop: 10 }}>
//         {groupIds.length > 0 && (
//           <GroupTabs groups={groups} onGroupSelect={this.onGroupSelect} selectedGroup={groupId} />
//         )}
//         <View>
//           <PropForm
//             knobs={knobsArray}
//             onFieldChange={this.handleChange}
//             onFieldPress={this.handlePress}
//           />
//         </View>
//         <Touchable onPress={this.reset}>
//           <ResetButton>RESET</ResetButton>
//         </Touchable>
//       </View>
//     );
//   }
// }
