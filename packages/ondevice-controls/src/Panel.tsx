import React from 'react';

export const AddonPanel = ({ active, children }) => {
  if (!active) {
    return null;
  }
  return <>{children}</>;
};

AddonPanel.displayName = 'AddonPanel';
