# Connecting Devices

In order to work with React Native Storybook, one or more devices should be connected. Stories will only show when devices are available.

## iOS simulator

-   Start with `react-native run-ios`

## Android emulator

-   Get your AVD name with `emulator -list-avds`
-   Start the emulator `emulator -avd MY_AVD_NAME`
-   Forward port 8081 `adb reverse tcp:8081 tcp:8081`
-   Forward port 9001 `adb reverse tcp:9001 tcp:9001`
-   Start with `react-native run-android`

### Issues
**Problem**: If you run into a `No such file or directory` error

**Solution**: You must run the emulator from its directory: `cd $(dirname $(which emulator)) && ./emulator -avd MY_AVD_NAME`

## Android device

-   Connect your device with adb
-   Forward port 8081 `adb reverse tcp:8081 tcp:8081`
-   Forward port 9001 `adb reverse tcp:9001 tcp:9001`
-   Start with `react-native run-android`
