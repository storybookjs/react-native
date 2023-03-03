import React from 'react';
import styled from '@emotion/native';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { ANIMATION_DURATION_TRANSITION } from '../../../../constants';

/**
 * Component that mimics the addons panel.
 *
 * The main reason this exists is that the scaled addons view feels more
 * cluttered than a more abstract skeleton view, which allows users to focus
 * on the story content rather than become distracted by the addons UI in an
 * already small view.
 */
export const AddonsSkeleton = React.memo(function AddonsSkeleton({ visible }: AddonsSkeletonProps) {
  const progress = React.useRef(new Animated.Value(visible ? 1 : 0));
  React.useEffect(() => {
    Animated.timing(progress.current, {
      toValue: visible ? 1 : 0,
      duration: ANIMATION_DURATION_TRANSITION,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.cubic),
    }).start();
  }, [visible]);

  return (
    <AddonsSkeletonContainer pointerEvents="none" opacity={progress.current}>
      <TabsSkeleton />
      <AddonsContentSkeleton />
    </AddonsSkeletonContainer>
  );
});

const TabSkeleton = styled.View(({ theme, active }) => ({
  opacity: active ? 1 : 0.5,
  backgroundColor: active ? theme.tabs.activeBackgroundColor : theme.tokens.color.grey200,
  borderRadius: theme.tokens.borderRadius.round,
  width: active ? 100 : 70,
  height: 30,
  marginRight: 12,
}));

const BoxSkeleton = styled.View(({ theme, width, height }) => ({
  backgroundColor: theme.tokens.color.blue200,
  borderRadius: theme.tokens.borderRadius.large,
  height,
  width,
}));

function AddonsFieldSkeleton({ long = false }: { long?: boolean }) {
  return (
    <View style={{ marginBottom: 32 }}>
      <BoxSkeleton width={75} height={10} marginBottom={12} />
      <BoxSkeleton width={long ? 200 : 120} height={15} />
    </View>
  );
}

function AddonsContentSkeleton() {
  return (
    <>
      <AddonsFieldSkeleton long />
      <AddonsFieldSkeleton long />
      <AddonsFieldSkeleton />
      <AddonsFieldSkeleton />
    </>
  );
}

function TabsSkeleton() {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
      <TabSkeleton />
      <TabSkeleton active />
      <TabSkeleton />
    </View>
  );
}

interface AddonsSkeletonProps {
  visible: boolean;
}

const AddonsSkeletonContainer = styled(Animated.View)(({ theme }) => ({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
  backgroundColor: theme.panel.backgroundColor,
  borderTopWidth: theme.panel.borderWidth,
  borderColor: theme.panel.borderColor,
  padding: theme.panel.paddingHorizontal,
  overflow: 'hidden',
}));
