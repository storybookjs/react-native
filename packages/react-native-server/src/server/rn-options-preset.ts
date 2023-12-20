import { SET_CURRENT_STORY } from '@storybook/core-events';
import { Channel } from '@storybook/channels';
import { Options } from '@storybook/types';
import Server from '.';

// export const managerHead = async (
//   existing: string,
//   options: Options & { storybookOptions: any }
// ) => {
//   const { storybookOptions } = options;

//   return `
//     <script>
//       window.storybookOptions = ${JSON.stringify(storybookOptions)};
//     </script>
//     ${existing}
//   `;
// };

type CustomOptions = Options & { storybookOptions: any; extendedServer: Server };

export const experimental_serverChannel = async (channel: Channel, options: CustomOptions) => {
  channel.on(SET_CURRENT_STORY, async (data) => {
    console.log('relaying from storybook channel:', data);
    options.extendedServer.wsServer.emit(SET_CURRENT_STORY, data);
  });

  options.extendedServer.wsServer.on('connection', (s, req) => {
    s.on('message', (data) => {
      console.log('recieved from upstream channel:', data);
      // channel.emit('', data);
    });
  });
};
