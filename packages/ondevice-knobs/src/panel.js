import React from 'react';
import { View, Text, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { SET_CURRENT_STORY, FORCE_RE_RENDER } from '@storybook/core-events';
import { SET, SET_OPTIONS, RESET, CHANGE, CLICK } from '@storybook/addon-knobs';
import { styled } from '@storybook/react-native-theming';
import GroupTabs from './GroupTabs';
import PropForm from './PropForm';

const getTimestamp = () => +new Date();

const DEFAULT_GROUP_ID = 'Other';

const Touchable = styled.TouchableOpacity(({ theme }) => ({
  backgroundColor: theme.button.secondary.backgroundColor,
  borderRadius: theme.button.secondary.borderRadius,
  borderWidth: theme.button.secondary.borderWidth,
  borderColor: theme.button.secondary.borderColor,
  paddingVertical: theme.button.paddingVertical,
  paddingHorizontal: theme.button.paddingHorizontal,
  justifyContent: 'center',
  alignItems: 'center',
}));

const ResetButton = styled.Text(({ theme }) => ({
  color: theme.button.secondary.textColor,
  fontSize: theme.button.fontSize,
  fontWeight: theme.button.fontWeight,
}));

const Paragraph = styled.Text(({ theme }) => ({
  marginBottom: theme.tokens.spacing3,
  color: theme.text.primaryColor,
}));

const LinkText = styled.Text(({ theme }) => ({
  color: theme.text.linkColor,
}));

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setKnobs = this.setKnobs.bind(this);
    this.reset = this.reset.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.onGroupSelect = this.onGroupSelect.bind(this);

    this.state = { knobs: {}, groupId: DEFAULT_GROUP_ID };
    this.options = {};

    this.lastEdit = getTimestamp();
    this.loadedFromUrl = false;
  }

  componentDidMount() {
    const { channel } = this.props;

    channel.on(SET, this.setKnobs);
    channel.on(SET_OPTIONS, this.setOptions);
    channel.on(SET_CURRENT_STORY, this.selectStory);
    channel.emit(FORCE_RE_RENDER);
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener(SET, this.setKnobs);
    channel.removeListener(SET_CURRENT_STORY, this.selectStory);
  }

  onGroupSelect(name) {
    this.setState({ groupId: name });
  }

  setOptions(options = { timestamps: false }) {
    this.options = options;
  }

  setKnobs({ knobs, timestamp }) {
    if (!this.options.timestamps || !timestamp || this.lastEdit <= timestamp) {
      this.setState({ knobs });
    }
  }

  reset = () => {
    const { channel } = this.props;
    this.setState({ knobs: {} });
    channel.emit(RESET);
  };

  selectStory = () => {
    const { channel } = this.props;
    this.setState({ knobs: {}, groupId: DEFAULT_GROUP_ID });
    channel.emit(RESET);
  };

  emitChange(changedKnob) {
    const { channel } = this.props;
    channel.emit(CHANGE, changedKnob);
  }

  handleChange(changedKnob) {
    this.lastEdit = getTimestamp();
    const { knobs } = this.state;
    const { name } = changedKnob;
    const newKnobs = { ...knobs };
    newKnobs[name] = {
      ...newKnobs[name],
      ...changedKnob,
    };

    this.setState({ knobs: newKnobs });

    this.setState(
      { knobs: newKnobs },
      this.emitChange(
        changedKnob.type === 'number'
          ? { ...changedKnob, value: parseFloat(changedKnob.value) }
          : changedKnob
      )
    );
  }

  handleClick(knob) {
    const { channel } = this.props;

    channel.emit(CLICK, knob);
  }

  render() {
    const { active } = this.props;

    if (!active) {
      return null;
    }

    const { knobs, groupId: stateGroupId } = this.state;

    const groups = {};
    const groupIds = [];

    let knobsArray = Object.keys(knobs);

    const knobsWithGroups = knobsArray.filter((key) => knobs[key].groupId);

    knobsWithGroups.forEach((key) => {
      const knobKeyGroupId = knobs[key].groupId;
      groupIds.push(knobKeyGroupId);
      groups[knobKeyGroupId] = {
        render: () => <Text id={knobKeyGroupId}>{knobKeyGroupId}</Text>,
        title: knobKeyGroupId,
      };
    });

    const allHaveGroups = groupIds.length > 0 && knobsArray.length === knobsWithGroups.length;

    // If all of the knobs are assigned to a group, we don't need the default group.
    const groupId =
      stateGroupId === DEFAULT_GROUP_ID && allHaveGroups
        ? knobs[knobsWithGroups[0]].groupId
        : stateGroupId;

    if (groupIds.length > 0) {
      if (!allHaveGroups) {
        groups[DEFAULT_GROUP_ID] = {
          render: () => <Text id={DEFAULT_GROUP_ID}>{DEFAULT_GROUP_ID}</Text>,
          title: DEFAULT_GROUP_ID,
        };
      }

      if (groupId === DEFAULT_GROUP_ID) {
        knobsArray = knobsArray.filter((key) => !knobs[key].groupId);
      }

      if (groupId !== DEFAULT_GROUP_ID) {
        knobsArray = knobsArray.filter((key) => knobs[key].groupId === groupId);
      }
    }

    knobsArray = knobsArray.map((key) => knobs[key]);

    if (knobsArray.length === 0) {
      return (
        <>
          <Paragraph>This story is not configured to handle knobs.</Paragraph>
          <Paragraph>
            Knobs are deprecated, consider migrating{' '}
            <LinkText
              onPress={() =>
                Linking.openURL('https://storybook.js.org/docs/react/essentials/controls')
              }
            >
              to Storybook controls
            </LinkText>{' '}
            and see{' '}
            <LinkText
              onPress={() =>
                Linking.openURL(
                  'https://github.com/storybookjs/react-native/tree/next-6.0/examples/expo-example/components/ControlExamples'
                )
              }
            >
              examples in the Storybook React Native repository.
            </LinkText>
          </Paragraph>
        </>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {groupIds.length > 0 && (
          <GroupTabs groups={groups} onGroupSelect={this.onGroupSelect} selectedGroup={groupId} />
        )}
        <PropForm
          knobs={knobsArray}
          onFieldChange={this.handleChange}
          onFieldClick={this.handleClick}
        />
        <Touchable onPress={this.reset}>
          <ResetButton>RESET</ResetButton>
        </Touchable>
      </View>
    );
  }
}

Panel.propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  onReset: PropTypes.object, // eslint-disable-line
};
