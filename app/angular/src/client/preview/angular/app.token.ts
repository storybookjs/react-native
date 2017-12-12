// import { InjectionToken } from "@angular/core";
// export const STORY = new InjectionToken<Data>("story");

import { OpaqueToken } from "@angular/core";
export const STORY = new OpaqueToken("story");


export type Data = {
  component: any;
  props: object;
  propsMeta: object;
}