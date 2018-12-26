import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

class GroupTabs extends Component {
  renderTab(name, group) {
    let { title } = group;
    if (typeof title === 'function') {
      title = title();
    }

    const { onGroupSelect, selectedGroup } = this.props;

    return (
      <TouchableOpacity
        style={{
          marginRight: 15,
          paddingBottom: 10,
        }}
        key={name}
        onPress={() => onGroupSelect(name)}
      >
        <Text
          style={{
            color: selectedGroup === name ? 'black' : '#ccc',
            fontSize: 17,
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { groups } = this.props;

    const entries = groups ? Object.entries(groups) : null;

    return entries && entries.length ? (
      <ScrollView
        horizontal
        style={{
          marginHorizontal: 10,
          flexDirection: 'row',
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        }}
      >
        {entries.map(([key, value]) => this.renderTab(key, value))}
      </ScrollView>
    ) : (
      <Text>no groups available</Text>
    );
  }
}

GroupTabs.defaultProps = {
  groups: {},
  onGroupSelect: () => {},
  selectedGroup: null,
};

GroupTabs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  groups: PropTypes.object,
  onGroupSelect: PropTypes.func,
  selectedGroup: PropTypes.string,
};

export default GroupTabs;
