import React from 'react';
import { View } from 'react-native';

export const AddonPanel = ({ active, children }) => {
  if (!active) {
    return null;
  }
  return <View>{children}</View>;
};

AddonPanel.displayName = 'AddonPanel';
