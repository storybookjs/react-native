import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import styled from '@emotion/native';
import { Collection } from '@storybook/addons';
import Button from '../navigation/button';
import { EmotionProps } from '../../Shared/theme';

const Container = styled.View`
  flex-direction: row;
  border-bottom-width: 1;
  border-bottom-color: ${(props: EmotionProps) => props.theme.borderColor};
`;

export interface Props {
  panels: Collection;
  addonSelected: string;
  onPressAddon: (id: string) => void;
}

export default class AddonList extends PureComponent<Props> {
  renderTab = (id: string, title: string) => {
    const { addonSelected, onPressAddon } = this.props;

    return (
      <Button active={id === addonSelected} key={id} id={id} onPress={() => onPressAddon(id)}>
        {title.toUpperCase()}
      </Button>
    );
  };

  render() {
    const { panels } = this.props;
    const addonKeys = Object.keys(panels);

    return (
      <Container>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          {addonKeys.map(id => this.renderTab(id, panels[id].title))}
        </ScrollView>
      </Container>
    );
  }
}
