import React, { Dispatch, SetStateAction } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GestureRecognizer from 'react-native-swipe-gestures';
import Bar from './Bar';
import VisibilityButton from './VisibilityButton';

const SWIPE_CONFIG = {
  velocityThreshold: 0.2,
  directionalOffsetThreshold: 80,
};

interface Props {
  tabOpen: number;
  onChangeTab: (index: number) => void;
  isUIVisible: boolean;
  setIsUIVisible: Dispatch<SetStateAction<boolean>>;
}

const navStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
};

const Navigation = ({ tabOpen, onChangeTab, isUIVisible, setIsUIVisible }: Props) => {
  const insets = useSafeAreaInsets();

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
          <Bar index={tabOpen} onPress={onChangeTab} style={{ paddingBottom: insets.bottom }} />
        </GestureRecognizer>
      )}
      <VisibilityButton onPress={handleToggleUI} style={{ marginBottom: insets.bottom }} />
    </View>
  );
};
export default React.memo(Navigation);
