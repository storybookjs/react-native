import React, { useState } from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GestureRecognizer from 'react-native-swipe-gestures';
import Bar from './Bar';
import VisibilityButton from './VisibilityButton';

const SWIPE_CONFIG = {
  velocityThreshold: 0.2,
  directionalOffsetThreshold: 80,
};

interface Props {
  initialUiVisible?: boolean;
  tabOpen: number;
  onChangeTab: (index: number) => void;
}

const Navigation = ({ tabOpen, onChangeTab, initialUiVisible }: Props) => {
  const insets = useSafeAreaInsets();
  const navStyle: ViewProps['style'] = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: insets.bottom,
  };

  const [isUIVisible, setIsUIVisible] = useState(
    initialUiVisible !== undefined ? initialUiVisible : true
  );

  const handleToggleUI = () => {
    setIsUIVisible((oldIsUIVisible) => !oldIsUIVisible);
  };

  const handleSwipeLeft = () => {
    if (tabOpen < 1) {
      onChangeTab(tabOpen + 1);
    }
  };

  const handleSwipeRight = () => {
    if (tabOpen > -1) {
      onChangeTab(tabOpen - 1);
    }
  };

  return (
    <View style={navStyle}>
      {isUIVisible && (
        <GestureRecognizer
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          config={SWIPE_CONFIG}
        >
          <Bar index={tabOpen} onPress={onChangeTab} />
        </GestureRecognizer>
      )}
      <VisibilityButton onPress={handleToggleUI} />
    </View>
  );
};
export default React.memo(Navigation);
