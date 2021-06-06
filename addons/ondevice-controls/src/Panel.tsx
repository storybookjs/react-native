// import React, { useRef, useEffect } from 'react';
import React from 'react';
import { View } from 'react-native';

// const usePrevious = (children) => {
//   const ref = useRef();
//   useEffect(() => {
//     // happens after return
//     ref.current = children;
//   }, [children]);
//   return ref.current;
// };

// const useUpdate = (update, children) => {
//   const previousChildren = usePrevious(children);
//   return update ? children : previousChildren;
// };

export const AddonPanel = ({ active, children }) => {
  if (!active) {
    return null;
  }
  return <View>{children}</View>;
};
AddonPanel.displayName = 'AddonPanel';
