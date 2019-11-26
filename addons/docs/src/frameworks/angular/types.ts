export interface Method {
  name: string;
  args: Argument[];
  returnType: string;
  decorators: Decorator[];
  description: string;
}

export interface Property {
  name: string;
  decorators: Decorator[];
  type: string;
  optional: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Directive {
  name: string;
  propertiesClass: Property[];
  inputsClass: Property[];
  outputsClass: Property[];
  methodsClass: Method[];
  rawdescription: string;
}

export type Component = Directive;

export interface Argument {
  name: string;
  type: string;
  optional?: boolean;
}

export interface Decorator {
  name: string;
}

export interface CompodocJson {
  directives: Directive[];
  components: Component[];
}
