import { InjectionToken } from '@angular/core';

export const STORY = new InjectionToken<Data>('story');

export interface Data {
  component: any;
  props: object;
  propsMeta: object;
}