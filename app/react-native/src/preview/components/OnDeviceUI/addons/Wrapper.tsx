import { useTheme } from 'emotion-theming';
import React from 'react';
import { ScrollView } from 'react-native';
import styled from '@emotion/native';
import { Collection } from '@storybook/addons';

export interface Props {
  panels: Collection;
  addonSelected: string;
}

const Container = styled.View<{ selected: boolean }>(({ selected }) => ({
  display: selected ? 'flex' : 'none',
  flex: 1,
}));

const Wrapper = ({ panels, addonSelected }: Props) => {
  const theme: any = useTheme();
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
