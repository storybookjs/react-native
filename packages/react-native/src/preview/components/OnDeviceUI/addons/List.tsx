import React from 'react';
import { Addon_Collection } from '@storybook/types';

import { TabBar, TabButton } from '../../Shared/tabs';

export interface Props {
  panels: Addon_Collection;
  addonSelected: string;
  onPressAddon: (id: string) => void;
}

const AddonList = ({ panels, addonSelected, onPressAddon }: Props) => {
  const addonKeys = Object.keys(panels);

  return (
    <TabBar scrollable>
      {addonKeys.map((id) => {
        const { title } = panels[id];
        let resolvedTitle = typeof title === 'function' ? title() : title;

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
