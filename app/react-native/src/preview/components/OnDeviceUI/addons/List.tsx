import React from 'react';
import { ScrollView } from 'react-native';
import styled from '@emotion/native';
import { Collection } from '@storybook/addons';
import Button from '../navigation/Button';

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: theme.borderColor || '#e6e6e6',
}));

export interface Props {
  panels: Collection;
  addonSelected: string;
  onPressAddon: (id: string) => void;
}

const AddonList = ({ panels, addonSelected, onPressAddon }: Props) => {
  const addonKeys = Object.keys(panels);

  const renderTab = (id: string, title: string) => (
    <Button active={id === addonSelected} key={id} id={id} onPress={() => onPressAddon(id)}>
      {title.toUpperCase()}
    </Button>
  );

  return (
    <Container>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {addonKeys.map((id) => {
          const { title } = panels[id];
          const resolvedTitle = typeof title === 'function' ? title() : title;
          return renderTab(id, resolvedTitle);
        })}
      </ScrollView>
    </Container>
  );
};
export default React.memo(AddonList);
