import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { useIsSplitPanelVisible, useIsUIVisible } from '../../../../hooks';

import { BackgroundIcon, Icon, IconName } from '../../Shared/icons';
import { Box } from '../../Shared/layout';

const hitSlop = { top: 5, left: 5, right: 5, bottom: 5 };

interface NavigationButtonProps {
  iconName: IconName;
  inverseIconName: IconName;
  toggle: () => void;
  active: boolean;
}

function NavigationButton({ iconName, inverseIconName, active, toggle }: NavigationButtonProps) {
  return (
    <TouchableWithoutFeedback onPress={toggle} hitSlop={hitSlop}>
      <Box marginHorizontal={8}>
        <BackgroundIcon flex={1} name={inverseIconName} opacity={0.8}>
          <Icon name={iconName} opacity={active ? 0.6 : 0.25} />
        </BackgroundIcon>
      </Box>
    </TouchableWithoutFeedback>
  );
}

export function VisibilityButton() {
  const [active, toggle] = useIsUIVisible();
  return (
    <NavigationButton
      iconName="layout-bottom"
      inverseIconName="layout-bottom-inverse"
      active={active}
      toggle={() => toggle()}
    />
  );
}

export function AddonsSplitButton() {
  const [active, toggle] = useIsSplitPanelVisible();
  return (
    <NavigationButton
      iconName="layout-split"
      inverseIconName="layout-split-inverse"
      active={active}
      toggle={() => toggle()}
    />
  );
}
