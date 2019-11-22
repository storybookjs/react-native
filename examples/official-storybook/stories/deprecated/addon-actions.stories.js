import { window, File } from 'global';
import React, { Fragment } from 'react';
import {
  action,
  actions,
  configureActions,
  decorate,
  decorateAction,
} from '@storybook/addon-actions';
import { Form } from '@storybook/components';

const { Button } = Form;

const pickNative = decorate([args => [args[0].nativeEvent]]);
const pickNativeAction = decorateAction([args => [args[0].nativeEvent]]);

export default {
  title: 'Addons/Actions/deprecated',
};

export const DecoratedAction = () => (
  <Button onClick={pickNativeAction('decorated')}>Native Event</Button>
);

DecoratedAction.story = {
  name: 'Decorated Action',
};
