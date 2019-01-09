import { ReactElement } from 'react';
import { Channel } from '@storybook/channels';
import { types, Types, isSupportedType } from './types';
export interface Options {
    active: boolean;
}
export interface Addon {
    title: string;
    type?: Types;
    id?: string;
    render(options: Options): ReactElement<any>;
}
export declare type Loader = (callback: (api: any) => void) => void;
export { types, isSupportedType };
interface Collection {
    [key: string]: Addon;
}
export declare class AddonStore {
    private loaders;
    private elements;
    private channel;
    getChannel: () => Channel;
    hasChannel: () => boolean;
    setChannel: (channel: Channel) => void;
    getElements: (type: string) => Collection;
    addPanel: (name: string, options: Addon) => void;
    add: (name: string, options: Addon) => void;
    register: (name: string, registerCallback: (api: any) => void) => void;
    loadAddons: (api: any) => void;
}
export declare const addons: any;
