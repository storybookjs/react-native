import React from 'react';
import { Text } from 'react-native';
import { addons } from '@storybook/addons';
import { useSelectedAddon } from '../../../../hooks';
import AddonsList from './List';
import AddonWrapper from './Wrapper';
import { Box } from '../../Shared/layout';

interface AddonsProps {
  active: boolean;
}

const Addons = ({ active }: AddonsProps) => {
  const panels = addons.getElements('panel');
  const [addonSelected, setAddonSelected] = useSelectedAddon(Object.keys(panels)[0]);

  if (Object.keys(panels).length === 0) {
    return (
      <Box alignItems="center" justifyContent="center">
        <Text>No addons loaded.</Text>
      </Box>
    );
  }

  return (
    <Box flex>
      <AddonsList
        onPressAddon={setAddonSelected}
        panels={panels}
        addonSelected={active ? addonSelected : null}
      />
      <AddonWrapper addonSelected={active ? addonSelected : null} panels={panels} />
    </Box>
  );
};

export default React.memo(Addons);
