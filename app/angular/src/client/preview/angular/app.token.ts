import { InjectionToken } from "@angular/core";

export const STORY = new InjectionToken<Data>("story");

export type Data = {
  component: any;
  props: {[p: string]: any};
  propsMeta: {[p: string]: any};
}