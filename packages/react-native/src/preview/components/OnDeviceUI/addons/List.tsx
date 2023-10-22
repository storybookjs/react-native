import React from 'react';
import { Collection } from '@storybook/addons';

import { TabBar, TabButton } from '../../Shared/tabs';

export interface Props {
  panels: Collection;
  addonSelected: string;
  onPressAddon: (id: string) => void;
}

const AddonList = ({ panels, addonSelected, onPressAddon }: Props) => {
  const addonKeys = Object.keys(panels);

  return (
    <TabBar scrollable>
      {addonKeys.map((id) => {
        const { title } = panels[id];
        const resolvedTitle = typeof title === 'function' ? title() : title;
        return (
          <TabButton
            active={id === addonSelected}
            key={id}
            id={id}
            onPress={() => onPressAddon(id)}
          >
            {resolvedTitle.toUpperCase()}
          </TabButton>
        );
      })}
    </TabBar>
  );
};
export default React.memo(AddonList);
