import { ReactElement } from 'react';

export const ADDON_ID = 'storybooks/notes';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `notes`;

// TODO: this should come from some core package?
export interface API {
  on(event: string, callback: (...args: any) => any): void;
  off(event: string, callback: (...args: any) => any): void;
  emit(event: string, callback: (...args: any) => any): void;

  getParameters(id: string, scope?: string): undefined | Parameters;
  getElements(
    type: string
  ): {
    [id: string]: {
      id: string;
      render: () => ReactElement<any>;
    };
  };
}

interface TextParameter {
  text: string;
}
interface MarkdownParameter {
  markdown: string;
}
interface DisabledParameter {
  disable: boolean;
}

export type Parameters = string | TextParameter | MarkdownParameter | DisabledParameter;
