import { addons } from '@storybook/manager-api';
import { styled } from '@storybook/react-native-theming';
import { Addon_TypesEnum } from '@storybook/types';
import React from 'react';
import { View } from 'react-native';
import { useSelectedAddon, useStoryContext } from '../../../../hooks';
import AddonsList from './List';
import AddonWrapper from './Wrapper';

interface AddonsProps {
  active: boolean;
}

const Text = styled.Text(({ theme }: any) => ({
  marginTop: theme.tokens.spacing4,
}));

const Addons = ({ active }: AddonsProps) => {
  const panels = addons.getElements(Addon_TypesEnum.PANEL);
  const [addonSelected, setAddonSelected] = useSelectedAddon(Object.keys(panels)[0]);
  const context = useStoryContext();
  const id = context?.id;

  if (!id) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>No Story Selected</Text>
      </View>
    );
  }

  if (Object.keys(panels).length === 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>No addons loaded.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AddonsList
        onPressAddon={setAddonSelected}
        panels={panels}
        addonSelected={active ? addonSelected : null}
      />
      <AddonWrapper addonSelected={active ? addonSelected : null} panels={panels} />
    </View>
  );
};

export default React.memo(Addons);
