import { IApi, IStoribookSection } from '../../../index';

export function storiesOf(kind: string, module: NodeModule): IApi;
export function setAddon(addon: any): void;
export function addDecorator(decorator: any): IApi;
export function configure(loaders: () => void, module: NodeModule): void;
export function getStorybook(): IStoribookSection[];
export function clearDecorators(): void;
export function forceReRender(): void;
