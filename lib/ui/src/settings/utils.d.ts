import { KeyBoardEvent } from '../keyboard/keybinding';
export declare const isShortcutTaken: (arr1: string[], arr2: string[]) => boolean;
export declare const parseKey: (e: KeyBoardEvent) => string[];
export declare const keyToSymbol: (key: string) => string;
export declare const labelsArr: string[];
export declare const defaultShortcutSets: Readonly<{
    fullScreen: {
        value: string[];
        error: boolean;
    };
    togglePanel: {
        value: string[];
        error: boolean;
    };
    panelPosition: {
        value: string[];
        error: boolean;
    };
    navigation: {
        value: string[];
        error: boolean;
    };
    toolbar: {
        value: string[];
        error: boolean;
    };
    search: {
        value: string[];
        error: boolean;
    };
    focusNav: {
        value: string[];
        error: boolean;
    };
    focusIframe: {
        value: string[];
        error: boolean;
    };
    focusPanel: {
        value: string[];
        error: boolean;
    };
    prevComponent: {
        value: string[];
        error: boolean;
    };
    nextComponent: {
        value: string[];
        error: boolean;
    };
    prevStory: {
        value: string[];
        error: boolean;
    };
    nextStory: {
        value: string[];
        error: boolean;
    };
    shortcutsPage: {
        value: any[];
        error: boolean;
    };
    aboutPage: {
        value: string[];
        error: boolean;
    };
}>;
export declare const serializableKeyboardShortcuts: {
    fullScreen: string[];
    togglePanel: string[];
    panelPosition: string[];
    navigation: string[];
    toolbar: string[];
    search: string[];
    focusNav: string[];
    focusIframe: string[];
    focusPanel: string[];
    prevComponent: string[];
    nextComponent: string[];
    prevStory: string[];
    nextStory: string[];
    shortcutsPage: any[];
    aboutPage: string[];
};
export declare const shortcutKeyShape: {
    fullScreen: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    togglePanel: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    panelPosition: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    navigation: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    toolbar: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    search: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    focusNav: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    focusIframe: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    focusPanel: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    prevComponent: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    nextComponent: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    prevStory: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    nextStory: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    shortcutsPage: import("prop-types").Validator<{
        [x: string]: string;
    }>;
    aboutPage: import("prop-types").Validator<{
        [x: string]: string;
    }>;
};
export declare const serializedLocalStorage: (obj: object) => object[];
export declare const initShortcutKeys: () => object;
export declare const mapToKeyEl: (inputValue: string[]) => string[];
