export const ADDON_ID = 'storybookjs/notes';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `notes`;

interface TextParameter {
  text: string;
}
interface MarkdownParameter {
  markdown: string;
}
interface DisabledParameter {
  disable: boolean;
}
type TabsParameter = Record<string, string>;

export type Parameters =
  | string
  | TextParameter
  | MarkdownParameter
  | DisabledParameter
  | TabsParameter;
