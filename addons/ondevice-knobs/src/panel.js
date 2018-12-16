import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import GroupTabs from './GroupTabs';
import PropForm from './PropForm';

const getTimestamp = () => +new Date();

const DEFAULT_GROUP_ID = 'ALL';

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

    channel.on('addon:knobs:setKnobs', this.setKnobs);
    channel.on('addon:knobs:setOptions', this.setOptions);

    channel.on('selectStory', this.reset);

    channel.emit('forceReRender');
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener('addon:knobs:setKnobs', this.setKnobs);
    channel.removeListener('selectStory', this.reset);
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
    channel.emit('addon:knobs:reset');
  };

  emitChange(changedKnob) {
    const { channel } = this.props;
    channel.emit('addon:knobs:knobChange', changedKnob);
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

    this.setState({ knobs: newKnobs }, this.emitChange(changedKnob));
  }

  handleClick(knob) {
    const { channel } = this.props;

    channel.emit('addon:knobs:knobClick', knob);
  }

  render() {
    const { active } = this.props;

    if (!active) {
      return null;
    }

    const { knobs, groupId } = this.state;

    const groups = {};
    const groupIds = [];

    let knobsArray = Object.keys(knobs);

    knobsArray
      .filter(key => knobs[key].groupId)
      .forEach(key => {
        const knobKeyGroupId = knobs[key].groupId;
        groupIds.push(knobKeyGroupId);
        groups[knobKeyGroupId] = {
          render: () => <Text id={knobKeyGroupId}>{knobKeyGroupId}</Text>,
          title: knobKeyGroupId,
        };
      });

    if (groupIds.length > 0) {
      groups[DEFAULT_GROUP_ID] = {
        render: () => <Text id={DEFAULT_GROUP_ID}>{DEFAULT_GROUP_ID}</Text>,
        title: DEFAULT_GROUP_ID,
      };
      if (groupId !== DEFAULT_GROUP_ID) {
        knobsArray = knobsArray.filter(key => knobs[key].groupId === groupId);
      }
    }

    knobsArray = knobsArray.map(key => knobs[key]);

    if (knobsArray.length === 0) {
      return <Text>NO KNOBS</Text>;
    }

    return (
      <View style={{ flex: 1 }}>
        {groupIds.length > 0 && (
          <GroupTabs groups={groups} onGroupSelect={this.onGroupSelect} selectedGroup={groupId} />
        )}
        <View>
          <PropForm
            knobs={knobsArray}
            onFieldChange={this.handleChange}
            onFieldClick={this.handleClick}
          />
        </View>
        <TouchableOpacity
          style={{
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#f7f4f4',
            padding: 4,
            margin: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={this.reset}
        >
          <Text>RESET</Text>
        </TouchableOpacity>
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
