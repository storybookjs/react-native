declare type ComponentType = import('react').ComponentType;
declare type ComponentProps<C> = import('react').ComponentProps<C>;
declare type FunctionComponent<P> = import('react').FunctionComponent<P>;
declare type ReactNode = import('react').ReactNode;
declare type Channel = import('@storybook/channels').Channel;

// util types
export declare type StringObject = {
  [key: string]: string;
};
export declare type NeverChildren = {
  children?: never;
};
export declare type UseChannel = (
  event: string,
  eventHandler: (...args: unknown[]) => void,
  input?: unknown[]
) => void;

// config types
export declare type Setting = {
  icon?: string;
  title: string;
  components?: ComponentType[];
  params?: {
    name: string;
    props: { [key: string]: unknown };
    default?: boolean;
  }[];
  options?: {
    deep?: boolean;
    disable?: boolean;
    cancelable?: boolean;
  };
};
export declare type WrapperSettings = {
  options: Setting[];
  parameters: Setting[];
};
export declare type ContextNode = Setting & {
    nodeId: string;
};

// duck types
export declare type UPDATE_PROPS_MAP = {
  type: 'UPDATE_PROPS_MAP';
  payload: {
    nodeId: string;
    props: unknown;
  };
};
export declare type PropsTreeUpdaterType = (
  nodes: ContextNode[]
) => ([nodeId, name]: [string, string?]) => UPDATE_PROPS_MAP;

// Component types
export declare type TAddonManager = FunctionComponent<
  NeverChildren & {
    channel: Channel;
  }
>;
export declare type TAddonWrapper = FunctionComponent<{
  channel: Channel;
  settings: WrapperSettings;
  children?: (ready: boolean) => ReactNode;
}>;
export declare type TMenuController = FunctionComponent<
  NeverChildren &
    ContextNode & {
      components?: never;
      setSelect: (nodeId: string, name?: string) => void;
    }
>;
export declare type TToolBar = FunctionComponent<
  NeverChildren & {
    setSelect: ComponentProps<TMenuController>['setSelect'];
    nodes: ContextNode[];
  }
>;
export declare type TToolBarMenu = FunctionComponent<
  NeverChildren & {
    icon: string;
    title: string;
    active: boolean;
    expanded: boolean;
    setExpanded: (state: boolean) => void;
    optionsProps: ComponentProps<TToolBarMenuOptions>;
  }
>;
export declare type TToolBarMenuOptions = FunctionComponent<
  NeverChildren & {
    activeName: string;
    list: string[];
    onSelectOption: (name: string) => () => void;
  }
>;
