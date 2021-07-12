import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
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
      <SafeAreaView style={styles.container}>
        <NoAddonContainer>
          <Label>No addons loaded.</Label>
        </NoAddonContainer>
      </SafeAreaView>
    );
  }

  return (
    <Container>
      <SafeAreaView style={styles.container}>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default React.memo(Addons);
