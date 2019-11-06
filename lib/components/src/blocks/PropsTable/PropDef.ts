export interface PropDefJsDocTags {
  params?: PropDefJsDocTag[];
  returns?: PropDefJsDocTag;
}

export interface PropDefJsDocTag {
  name?: string;
  description?: string;
}

export interface PropDef {
  name: string;
  type: any;
  required: boolean;
  description?: string;
  defaultValue?: string;
  jsDocTags?: PropDefJsDocTags;
}
