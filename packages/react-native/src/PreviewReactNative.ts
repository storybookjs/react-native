import { PreviewWithSelection } from '@storybook/core/preview-api';
import type { ReactRenderer } from '@storybook/react';

export class PreviewReactNative extends PreviewWithSelection<ReactRenderer> {
  get initializationPromise() {
    return this.storeInitializationPromise;
  }
}
