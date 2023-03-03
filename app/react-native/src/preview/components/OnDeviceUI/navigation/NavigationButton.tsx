import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { useIsUIVisible } from '../../../../hooks';

import { Icon, IconName } from '../../Shared/icons';
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
        <Icon flex={1} background name={inverseIconName} opacity={0.8} pointerEvents="none">
          <Icon name={iconName} opacity={active ? 0.6 : 0.25} />
        </Icon>
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
