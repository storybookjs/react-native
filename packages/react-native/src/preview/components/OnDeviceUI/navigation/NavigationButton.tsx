import { TouchableWithoutFeedback, View } from 'react-native';
import { useIsSplitPanelVisible, useIsUIVisible } from '../../../../hooks';
import { BackgroundIcon, Icon, IconName } from '../../Shared/icons';

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
      <View style={{ marginHorizontal: 8 }}>
        <BackgroundIcon style={{ flex: 1, opacity: 0.8 }} name={inverseIconName}>
          <Icon name={iconName} style={{ opacity: active ? 0.6 : 0.25 }} />
        </BackgroundIcon>
      </View>
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
