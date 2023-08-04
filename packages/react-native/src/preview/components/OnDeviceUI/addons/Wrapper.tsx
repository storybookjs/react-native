import React from 'react';
import { ScrollView } from 'react-native';
import { styled, useTheme } from '@storybook/react-native-theming';
import { Collection } from '@storybook/addons';
import { useUpdateOnStoryChanged } from '../../../../hooks';

export interface Props {
  panels: Collection;
  addonSelected: string;
}

const Container = styled.View<{ selected: boolean }>(({ selected }) => ({
  display: selected ? 'flex' : 'none',
  flex: 1,
}));

const Wrapper = ({ panels, addonSelected }: Props) => {
  // Force a re-render when the current story changes, to ensure that the addon
  // panels state is not desynced.
  useUpdateOnStoryChanged();
  const theme = useTheme();
  const addonKeys = Object.keys(panels);
  const content = addonKeys.map((id) => {
    const selected = addonSelected === id;

    return (
      <Container key={id} selected={selected}>
        <ScrollView contentContainerStyle={{ padding: theme.panel.paddingHorizontal }}>
          {panels[id].render({ active: selected, key: id })}
        </ScrollView>
      </Container>
    );
  });

  return <>{content}</>;
};
export default React.memo(Wrapper);
