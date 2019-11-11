import React, { FunctionComponent } from 'react';
import { addons, types } from '@storybook/addons';
import { ADDON_ID } from './constants';

const PreviewWrapper: FunctionComponent<{}> = p => (
  <div className="my-edit-wrapper">
    <button type="button" onClick={() => {}}>
      Edit this page
    </button>
    {p.children}
  </div>
);

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'edit page',
    type: types.PREVIEW,
    render: PreviewWrapper as any,
  });
});
