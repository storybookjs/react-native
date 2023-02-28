import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import styled from '@emotion/native';

// const Label = styled.Text(({ theme, active }) => ({
//   color: active ? theme.buttonActiveTextColor || '#444444' : theme.buttonTextColor || '#999999',
//   fontSize: 17,
// }));

const TabButtonTouchable = styled.TouchableOpacity(({ theme, active }) => ({
  borderWidth: theme.tabs.borderWidth,
  borderColor: active ? theme.tabs.activeBorderColor : theme.tabs.inactiveBorderColor,
  borderRadius: theme.tabs.borderRadius,
  backgroundColor: active ? theme.tabs.activeBackgroundColor : theme.tabs.inactiveBackgroundColor,
}));

const TabButtonText = styled.Text(({ theme, active }) => ({
  color: active ? theme.tabs.activeTextColor : theme.tabs.inactiveTextColor,
  paddingVertical: theme.tabs.paddingVertical * 0.5,
  paddingHorizontal: theme.tabs.paddingHorizontal,
  fontSize: theme.tabs.fontSize,
  fontWeight: theme.tabs.fontWeight,
}));

class GroupTabs extends Component {
  renderTab(name, group) {
    let { title } = group;
    if (typeof title === 'function') {
      title = title();
    }

    const { onGroupSelect, selectedGroup } = this.props;

    const active = selectedGroup === name;
    return (
      <TabButtonTouchable
        key={name}
        onPress={() => onGroupSelect(name)}
        active={active}
        activeOpacity={0.8}
      >
        <TabButtonText active={active}>{title}</TabButtonText>
      </TabButtonTouchable>
    );
  }

  render() {
    const { groups } = this.props;
    const entries = groups ? Object.entries(groups) : null;
    return entries && entries.length ? (
      <ScrollView
        horizontal
        style={{
          marginBottom: 12,
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
