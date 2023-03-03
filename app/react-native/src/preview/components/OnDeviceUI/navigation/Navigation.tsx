import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useIsUIVisible } from '../../../../hooks';
import { NavigationBar } from './NavigationBar';
import { VisibilityButton } from './NavigationButton';

const SWIPE_CONFIG = {
  velocityThreshold: 0.2,
  directionalOffsetThreshold: 80,
};

interface NavigationProps {
  tabOpen: number;
  onChangeTab: (index: number) => void;
  onLayout: ViewProps['onLayout'];
}

const navStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
};

const Navigation = ({ tabOpen, onChangeTab, onLayout }: NavigationProps) => {
  const insets = useSafeAreaInsets();

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

  const [isUIVisible] = useIsUIVisible();

  return (
    <View style={navStyle} onLayout={onLayout}>
      <View>
        {isUIVisible && (
          <GestureRecognizer
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            config={SWIPE_CONFIG}
          >
            <NavigationBar
              index={tabOpen}
              onPress={onChangeTab}
              style={{ paddingBottom: insets.bottom }}
            />
          </GestureRecognizer>
        )}
      </View>
      <NavigationShortcuts>
        <VisibilityButton />
      </NavigationShortcuts>
    </View>
  );
};
export default React.memo(Navigation);

function NavigationShortcuts({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        zIndex: 100,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        position: 'absolute',
        bottom: insets.bottom + 14,
        right: 8,
      }}
    >
      {children}
    </View>
  );
}
