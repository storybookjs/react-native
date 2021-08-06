import React, { Component } from 'react';
import css from '@emotion/css';
import { CreateStyled, CreateStyledComponentExtrinsic } from '@emotion/styled-base';
import ReactNative from 'react-native';

// https://github.com/emotion-js/emotion/pull/1176/
// meanwhile: https://github.com/emotion-js/emotion/issues/839#issuecomment-500195354
declare module '@emotion/native' {
  type StyledReactNativeComponents =
    | 'ActivityIndicator'
    | 'ActivityIndicatorIOS'
    | 'ART'
    | 'Button'
    | 'DatePickerIOS'
    | 'DrawerLayoutAndroid'
    | 'Image'
    | 'ImageBackground'
    | 'ImageEditor'
    | 'ImageStore'
    | 'KeyboardAvoidingView'
    | 'ListView'
    | 'MapView'
    | 'Modal'
    | 'NavigatorIOS'
    | 'Picker'
    | 'PickerIOS'
    | 'ProgressBarAndroid'
    | 'ProgressViewIOS'
    | 'ScrollView'
    | 'SegmentedControlIOS'
    | 'Slider'
    | 'SliderIOS'
    | 'SnapshotViewIOS'
    | 'Switch'
    | 'RecyclerViewBackedScrollView'
    | 'RefreshControl'
    | 'SafeAreaView'
    | 'StatusBar'
    | 'SwipeableListView'
    | 'SwitchAndroid'
    | 'SwitchIOS'
    | 'TabBarIOS'
    | 'Text'
    | 'TextInput'
    | 'ToastAndroid'
    | 'ToolbarAndroid'
    | 'Touchable'
    | 'TouchableHighlight'
    | 'TouchableNativeFeedback'
    | 'TouchableOpacity'
    | 'TouchableWithoutFeedback'
    | 'View'
    | 'ViewPagerAndroid'
    | 'WebView'
    | 'FlatList'
    | 'SectionList'
    | 'VirtualizedList';

  type StyledComponentsForReactNative<T extends keyof typeof ReactNative, ExtraProps, Theme> = {
    [K in T]: CreateStyledComponentExtrinsic<typeof ReactNative[K], ExtraProps, Theme>;
  };

  type MyTheme = {
    backgroundColor: string;
    headerTextColor: string;
    labelColor: string;
    borderColor: string;
    previewBorderColor: string;
    buttonTextColor: string;
    buttonActiveTextColor: string;
  };

  export interface Styled<Theme extends object = MyTheme, ExtraProps = {}>
    extends CreateStyled<Theme>,
      StyledComponentsForReactNative<StyledReactNativeComponents, ExtraProps, Theme> {}

  export { css };

  const styled: Styled;
  export default styled;
}
