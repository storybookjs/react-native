import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import { addons } from '@storybook/addons';
import AddonsList from './List';
import AddonWrapper from './Wrapper';
import { Label } from '../../Shared/text';

const NoAddonContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.backgroundColor,
}));

const Addons = ({ active }: { active: boolean }) => {
  const panels = addons.getElements('panel');
  const [addonSelected, setAddonSelected] = useState<string | null>(Object.keys(panels)[0] || null);

  if (Object.keys(panels).length === 0) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NoAddonContainer>
          <Label>No addons loaded.</Label>
        </NoAddonContainer>
      </SafeAreaView>
    );
  }

  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <AddonsList
          onPressAddon={setAddonSelected}
          panels={panels}
          addonSelected={active ? addonSelected : null}
        />
        <AddonWrapper addonSelected={active ? addonSelected : null} panels={panels} />
      </SafeAreaView>
    </Container>
  );
};

export default React.memo(Addons);
