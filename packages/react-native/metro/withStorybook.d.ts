import { MetroConfig } from 'metro-config';

interface WebsocketsOptions {
    port?: number;
    host?: string;
}
interface WithStorybookOptions {
    configPath?: string;
    enabled?: boolean;
    websockets?: WebsocketsOptions;
    useJs?: boolean;
    onDisabledRemoveStorybook?: boolean;
}
declare function withStorybook(config: MetroConfig, options?: WithStorybookOptions): MetroConfig;

export { withStorybook as default };
