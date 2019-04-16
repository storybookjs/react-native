import React, { PureComponent } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import GestureRecognizer, { GestureRecognizerConfig } from 'react-native-swipe-gestures';
import Bar from './bar';
import VisibilityButton from './visibility-button';

const SWIPE_CONFIG: GestureRecognizerConfig = {
  velocityThreshold: 0.2,
  directionalOffsetThreshold: 80,
};

const style = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

interface Props {
  initialUiVisible?: boolean;
  tabOpen: number;
  onChangeTab: (index: number) => void;
}

export default class Navigation extends PureComponent<Props> {
  state = {
    isUIVisible: this.props.initialUiVisible !== undefined ? this.props.initialUiVisible : true,
  };

  handleToggleUI = () => {
    const { isUIVisible } = this.state;

    this.setState({ isUIVisible: !isUIVisible });
  };

  handleSwipeLeft = () => {
    const { tabOpen, onChangeTab } = this.props;
    if (tabOpen < 1) {
      onChangeTab(tabOpen + 1);
    }
  };

  handleSwipeRight = () => {
    const { tabOpen, onChangeTab } = this.props;
    if (tabOpen > -1) {
      onChangeTab(tabOpen - 1);
    }
  };

  render() {
    const { tabOpen, onChangeTab } = this.props;
    const { isUIVisible } = this.state;

    return (
      <View style={style.wrapper}>
        <SafeAreaView>
          {isUIVisible && (
            <GestureRecognizer
              onSwipeLeft={this.handleSwipeLeft}
              onSwipeRight={this.handleSwipeRight}
              config={SWIPE_CONFIG}
            >
              <Bar index={tabOpen} onPress={onChangeTab} />
            </GestureRecognizer>
          )}
          <View>
            <VisibilityButton onPress={this.handleToggleUI} />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
