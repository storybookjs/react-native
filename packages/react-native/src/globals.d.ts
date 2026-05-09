import type { Channel } from 'storybook/internal/channels';
import type { PreviewWithSelection } from 'storybook/internal/preview-api';
import type { ReactRenderer } from '@storybook/react';
import type { Features } from './index';

type sbCoreGlobalFeatures = {
  measure?: boolean;
  outline?: boolean;
  interactions?: boolean;
  viewport?: boolean;
  highlight?: boolean;
  backgrounds?: boolean;
};

declare global {
  var global: typeof globalThis | undefined;
  var CHANNEL_OPTIONS: { maxDepth: number } | undefined;
  var FEATURES: (Features & sbCoreGlobalFeatures) | undefined;
  var STORYBOOK_WEBSOCKET:
    | {
        host?: string;
        port?: number;
        secured?: boolean;
      }
    | undefined;
  var __STORYBOOK_ADDONS_CHANNEL__: Channel | undefined;
  var __STORYBOOK_PREVIEW__: PreviewWithSelection<ReactRenderer> | undefined;
}
