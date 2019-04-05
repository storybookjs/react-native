declare type Channel = import('@storybook/channels').Channel;
declare type ComponentType = import('react').ComponentType;
declare type ComponentProps<C> = import('react').ComponentProps<C>;
declare type ReactNode = import('react').ReactNode;
declare type ReactElement = import('react').ReactElement;
declare type FC<P> = import('react').FunctionComponent<P>;

// auxiliary types
declare type FCNoChildren<P> = FC<{ children?: never } & P>;
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
declare type GenericFnWithReturn<T> = (...args: any[]) => T;
declare type GenericProps = { [key: string]: GenericProps } | null;
export declare type StringObject = { [key: string]: string };
export declare type StringTuple = [string, string];

// config types
export declare type AddonOptions = {
  deep?: boolean;
  disable?: boolean;
  cancelable?: boolean;
};
export declare type AddonSetting = {
  icon?: string;
  title: string;
  components?: ComponentType[];
  params?: {
    name: string;
    props: GenericProps;
    default?: boolean;
  }[];
  options?: AddonOptions;
};
export declare type WrapperSettings = {
  options?: AddonSetting[];
  parameters?: AddonSetting[];
};
export declare type ContextNode = Required<AddonSetting> & {
  nodeId: string;
};

// duck types
export declare type UPDATE_PROPS_MAP = {
  type: 'UPDATE_PROPS_MAP';
  payload: {
    nodeId: string;
    props: GenericProps | null;
  };
};
export declare type PropsMapUpdaterType = (
  nodes: ContextNode[]
) => ([nodeId, name]: StringTuple) => UPDATE_PROPS_MAP;

// helper types
export declare type RenderAggregatedComponents = (
  ...arg: [ComponentType[], GenericProps, AddonOptions, number]
) => GenericFnWithReturn<unknown>;
export declare type RenderAggregatedContexts = (
  ...arg: [ContextNode[], Exclude<GenericProps, null>]
) => GenericFnWithReturn<ReactElement>;
export declare type MergeSettings = (
  ...args: [Partial<AddonSetting>, Partial<AddonSetting>]
) => ContextNode;
export declare type GetNodes = (settings: WrapperSettings) => ContextNode[];
export declare type Memorize = <T, U extends any[]>(
  fn: (...arg: U) => T,
  resolver: (...arg: U) => unknown
) => (...arg: U) => T;
export declare type UseChannel = (
  event: string,
  eventHandler: GenericFnWithReturn<void>,
  input?: unknown[]
) => void;

// Component types
export declare type Wrapper = (...arg: [Function, unknown, WrapperSettings]) => ReactNode;
export declare type TAddonManager = FCNoChildren<{
  channel: Channel;
}>;
export declare type TAddonWrapper = FC<{
  channel: Channel;
  nodes: ContextNode[];
  children: (ready: boolean) => ReactNode;
}>;
export declare type TMenuController = FCNoChildren<
  Omit<
    ContextNode & {
      setSelect: (...arg: StringTuple) => void;
    },
    'components'
  >
>;
export declare type TToolBar = FCNoChildren<{
  setSelect: ComponentProps<TMenuController>['setSelect'];
  nodes: ContextNode[];
}>;
export declare type TToolBarMenu = FCNoChildren<{
  icon: string;
  title: string;
  active: boolean;
  expanded: boolean;
  setExpanded: (state: boolean) => void;
  optionsProps: ComponentProps<TToolBarMenuOptions>;
}>;
export declare type TToolBarMenuOptions = FCNoChildren<{
  activeName: string;
  list: string[];
  onSelectOption: (name: string) => () => void;
}>;

// core types
export declare type WithContexts = (contexts: AddonSetting[]) => any;
