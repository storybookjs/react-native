import React from 'react';
import { addons, types } from '@storybook/addons';
import { fileNameResolveType, EditStoriesProps } from './types';
import { PreviewPanel } from './components/PreviewPanel';

const ADDON_ID = 'EDIT_PAGE_SOURCES';

const defaultFileNameResolve: fileNameResolveType = info => {
  return info.fileName;
};

const defaultCMSProps: EditStoriesProps = {
  fileNameResolve: defaultFileNameResolve,
  editPageLabel: 'Edit this page',
};

export const editPage = (config: EditStoriesProps) => {
  addons.register(ADDON_ID, () => {
    addons.add(ADDON_ID, {
      title: 'Edit source',
      type: types.IFRAME_START,
      render: () => <PreviewPanel key={ADDON_ID} {...{ ...defaultCMSProps, ...config }} />,
    });
  });
};

if (module && (module as any).hot && (module as any).hot.decline) {
  (module as any).hot.decline();
}
