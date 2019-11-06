export interface DocgenInfo {
  type?: {
    name: string;
    value?: {
      name?: string;
      raw?: string;
    };
  };
  flowType?: any;
  tsType?: any;
  required: boolean;
  description?: string;
  defaultValue?: {
    value: string;
  };
}
