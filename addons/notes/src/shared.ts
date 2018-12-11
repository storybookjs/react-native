export const ADDON_ID = 'storybooks/notes';
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `notes`;

export interface API {
  on(event: string, callback: (...args: any) => any): void;
  off(event: string, callback: (...args: any) => any): void;
  emit(event: string, callback: (...args: any) => any): void;

  getParameters(id: string, scope?: string): undefined | Parameters;
}

export type Parameters =
  | string
  | {
      text?: string;
      markdown?: string;
      disable?: boolean;
    };
