import React, { PureComponent } from 'react';
import { SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import addons from '@storybook/addons';
import AddonsList from './list';
import AddonWrapper from './wrapper';
import { Label } from '../../Shared/text';
import { EmotionProps } from '../../Shared/theme';

const NoAddonContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
  background: ${(props: EmotionProps) => props.theme.backgroundColor};
`;

export default class Addons extends PureComponent<{}, { addonSelected: string }> {
  panels = addons.getElements('panel');

  constructor(props: {}) {
    super(props);

    this.state = {
      addonSelected: Object.keys(this.panels)[0] || null,
    };
  }

  onPressAddon = (addonSelected: string) => {
    this.setState({ addonSelected });
  };

  render() {
    const { addonSelected } = this.state;

    if (Object.keys(this.panels).length === 0) {
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
            onPressAddon={this.onPressAddon}
            panels={this.panels}
            addonSelected={addonSelected}
          />
          <AddonWrapper addonSelected={addonSelected} panels={this.panels} />
        </SafeAreaView>
      </Container>
    );
  }
}
