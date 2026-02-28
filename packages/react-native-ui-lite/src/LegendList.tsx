import { LegendList as LegendListWeb } from '@legendapp/list/react';
import {
  LegendList as LegendListNative,
  LegendListRef as LegendListRefNative,
  LegendListRenderItemProps as LegendListRenderItemPropsNative,
} from '@legendapp/list/react-native';
import { Platform } from 'react-native';

export type LegendListRenderItemProps<T> = LegendListRenderItemPropsNative<T>;
export type LegendListRef = LegendListRefNative;

const isWeb = Platform.OS === 'web';

export const LegendList = (isWeb ? LegendListWeb : LegendListNative) as typeof LegendListNative;
