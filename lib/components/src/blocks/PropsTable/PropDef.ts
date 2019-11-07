export interface JsDocParam {
  name: string;
  description?: string;
}

export interface JsDocReturns {
  description?: string;
}

export interface JsDocTags {
  params?: JsDocParam[];
  returns?: JsDocReturns;
}

export interface PropDef {
  name: string;
  // TODO: Change for a React component type.
  type: any;
  required: boolean;
  description?: string;
  defaultValue?: string;
  jsDocTags?: JsDocTags;
}
