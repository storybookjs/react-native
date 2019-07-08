import PropTypes from 'prop-types';
import React, { FunctionComponent, Validator } from 'react';

import { Form } from '@storybook/components';

export interface ButtonTypeKnob {
  name: string;
  value: unknown;
}

export type ButtonTypeOnClickProp = (knob: ButtonTypeKnob) => any;

export interface ButtonTypeProps {
  knob: ButtonTypeKnob;
  onClick: ButtonTypeOnClickProp;
}

const serialize = (): undefined => undefined;
const deserialize = (): undefined => undefined;

const ButtonType: FunctionComponent<ButtonTypeProps> & {
  serialize: typeof serialize;
  deserialize: typeof deserialize;
} = ({ knob, onClick }) => (
  <Form.Button type="button" name={knob.name} onClick={() => onClick(knob)}>
    {knob.name}
  </Form.Button>
);

ButtonType.defaultProps = {
  knob: {} as any,
};

ButtonType.propTypes = {
  // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
  knob: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired as Validator<any>,
  onClick: PropTypes.func.isRequired,
};

ButtonType.serialize = serialize;
ButtonType.deserialize = deserialize;

export default ButtonType;
