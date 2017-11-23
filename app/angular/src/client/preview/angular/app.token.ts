import { InjectionToken } from "@angular/core";

export const STORY = new InjectionToken<Data>("story");

export type Data = {
  component: any;
  props: object;
  propsMeta: object;
}