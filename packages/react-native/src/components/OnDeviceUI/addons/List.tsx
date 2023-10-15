import { Addon_BaseType, Addon_Collection } from '@storybook/types';
import React from 'react';

import { TabBar, TabButton } from '../../Shared/tabs';

export interface Props {
  panels: Addon_Collection<Addon_BaseType>;
  addonSelected: string;
  onPressAddon: (id: string) => void;
}

const AddonList = ({ panels, addonSelected, onPressAddon }: Props) => {
  return (
    <TabBar scrollable>
      {Object.values(panels).map(({ id, title }) => {
        let resolvedTitle = typeof title === 'function' ? title({}) : title;

        if (typeof resolvedTitle === 'string') {
          resolvedTitle = resolvedTitle.toUpperCase();
        }

        return (
          <TabButton
            active={id === addonSelected}
            key={id}
            id={id}
            onPress={() => onPressAddon(id)}
          >
            {resolvedTitle}
          </TabButton>
        );
      })}
    </TabBar>
  );
};
export default React.memo(AddonList);
