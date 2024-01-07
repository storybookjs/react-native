import { join, dirname } from 'path';
// import * as ws from 'ws';
import { WebSocketServer } from 'ws';
import * as querystring from 'querystring';
import { SET_CURRENT_STORY } from '@storybook/core-events';
import { Channel } from '@storybook/channels';
import { Options } from '@storybook/types';
import { StorybookConfig } from '@storybook/react-webpack5';
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

type ReactNativeServerOptions = {
  host?: string;
  port?: number;
};

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    // getAbsolutePath('@storybook/addon-react-native-web'),
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },

  // @ts-expect-error
  reactNativeServerOptions: {
    host: 'localhost',
    port: 7007,
  },

  webpackFinal: async (config, options) => {
    config.resolve.extensions = [
      '.web.mjs',
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    config.resolve.alias = {
      'react-native$': 'react-native-web',
      ...config.resolve.alias,
    };

    return config;
  },

  experimental_serverChannel: async (channel: Channel, { configType, presets }: Options) => {
    if (configType === 'DEVELOPMENT') {
      const options = await presets.apply<ReactNativeServerOptions>('reactNativeServerOptions');

      if (options) {
        const port = options.port ?? 7007;

        const host = options.host ?? 'localhost';

        const wss = new WebSocketServer({ port: 7007 });

        wss.on('connection', function connection(ws) {
          console.log('connection');

          ws.on('error', console.error);

          ws.on('message', function message(data) {
            const json = JSON.parse(data.toString());
            // if (data.toString().includes(SET_CURRENT_STORY))
            if (json.type === 'currentStoryWasSet') {
              console.log('received: %s', data);
              channel.emit(SET_CURRENT_STORY, json.args[0]);
            }
          });

          // ws.on('message', (data) => {
          //   console.log('recieved from upstream channel:', data);

          // wss.clients.forEach((c) => {
          //   c.send(data);
          // });
          // });

          // ws.send('something');
        });

        // channel.on(SET_CURRENT_STORY, async (data) => {
        //   console.log('relaying from storybook channel:', data);
        //   wss.clients.forEach((ws) =>
        //     ws.send(JSON.stringify({ type: SET_CURRENT_STORY, args: [data] }))
        //   );
        // });
        // const wss = new WebSocketServer({
        //   port,
        //   host,
        // });

        // wss.on('connection', (ws, req) => () => {
        //   console.log('connected', req.url);
        //   // ws.on('message', (data) => {
        //   //   console.log('recieved from upstream channel:', data);

        //   //   wss.clients.forEach((c) => {
        //   //     c.send(data);
        //   //   });
        //   // });

        //   ws.on('error', console.error);

        //   ws.on('message', function message(data) {
        //     console.log('received: %s', data);
        //   });

        //   ws.send('something');
        // });

        // wsServer.on('connection', (s, req) => {
        //   s.on('message', (data) => {
        //     console.log('recieved from upstream channel:', data);
        //     // channel.emit('', data);
        //   });
        // });
      }
    }

    return channel;
  },

  docs: {
    autodocs: 'tag',
  },
} satisfies StorybookConfig;

export default config;
