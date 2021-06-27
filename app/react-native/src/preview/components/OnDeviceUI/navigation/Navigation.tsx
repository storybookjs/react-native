import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
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
    <View>
      <SafeAreaView>
        {isUIVisible && (
          <GestureRecognizer
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            config={SWIPE_CONFIG}
          >
            <Bar index={tabOpen} onPress={onChangeTab} />
          </GestureRecognizer>
        )}
        <View>
          <VisibilityButton onPress={handleToggleUI} />
        </View>
      </SafeAreaView>
    </View>
  );
};
export default React.memo(Navigation);
