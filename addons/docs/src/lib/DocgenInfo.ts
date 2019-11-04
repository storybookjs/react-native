export interface DocgenInfo {
  type?: {
    name: string;
  };
  flowType?: any;
  tsType?: any;
  required: boolean;
  description?: string;
  defaultValue?: {
    value: string;
  };
}
