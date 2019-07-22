import PropTypes from 'prop-types';
import React, { FunctionComponent, Validator } from 'react';

import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

export type ButtonTypeKnob = KnobControlConfig<never>;

export interface ButtonTypeProps extends KnobControlProps<never> {
  knob: ButtonTypeKnob;
  onClick: ButtonTypeOnClickProp;
}

export type ButtonTypeOnClickProp = (knob: ButtonTypeKnob) => any;

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
  onClick: () => {},
};

ButtonType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired as Validator<ButtonTypeProps['knob']>,
  onClick: PropTypes.func.isRequired as Validator<ButtonTypeProps['onClick']>,
};

ButtonType.serialize = serialize;
ButtonType.deserialize = deserialize;

export default ButtonType;
