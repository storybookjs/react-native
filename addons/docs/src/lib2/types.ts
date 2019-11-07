import { PropsTableProps, PropDef } from '@storybook/components';
import { Component } from '../blocks/shared';

export type PropsExtractor = (component: Component) => PropsTableProps | null;

export interface DocgenInfo {
  type?: {
    name: string;
    value?: {
      name?: string;
      raw?: string;
    };
  };
  flowType?: {
    name: string;
  };
  tsType?: {
    name: string;
  };
  required: boolean;
  description?: string;
  defaultValue?: {
    value: string;
  };
}

// export class DocgenPropDef {
//   constructor(init: Partial<DocgenPropDef>) {
//     Object.assign(this, init);
//   }

//   name: string;

//   type: {
//     component: ReactNode;
//     typeSystem: TypeSystem;
//     raw: any;
//   };

//   required: boolean;

//   description?: string;

//   defaultValue?: string;

//   jsDocTags?: any;

//   toPropDef(): PropDef {
//     return {
//       ...this,
//       type: this.type.component,
//     };
//   }
// }

export enum TypeSystem {
  JavaScript = 'JavaScript',
  Flow = 'Flow',
  TypeScript = 'TypeScript',
  Unknown = 'Unknown',
}
