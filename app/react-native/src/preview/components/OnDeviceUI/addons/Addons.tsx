import React from 'react';

import { addons } from '@storybook/addons';
import { useSelectedAddon, useStoryContext } from '../../../../hooks';
import AddonsList from './List';
import AddonWrapper from './Wrapper';
import { Box } from '../../Shared/layout';
import styled from '@emotion/native';

interface AddonsProps {
  active: boolean;
}

const Text = styled.Text(({ theme }: any) => ({
  marginTop: theme.tokens.spacing4,
}));

const Addons = ({ active }: AddonsProps) => {
  const panels = addons.getElements('panel');
  const [addonSelected, setAddonSelected] = useSelectedAddon(Object.keys(panels)[0]);
  const context = useStoryContext();
  const id = context?.id;

  if (!id) {
    return (
      <Box alignItems="center" justifyContent="center">
        <Text>No Story Selected</Text>
      </Box>
    );
  }

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
