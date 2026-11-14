---
'@storybook/react-native-ui': patch
---

The on-device UI no longer crashes on launch on React Native 0.87 with react-native-worklets 0.12 ("[Worklets] Trying to convert a cyclic object to a serializable"). The menu backdrop and addons panel `useAnimatedStyle` worklets read `Platform.OS` inside the worklet, so Worklets tried to copy `Platform`, or in the published CommonJS build the whole `react-native` module, to the UI runtime. The platform check now happens outside the worklets, and the backdrop worklet only captures the sheet's animated index.
