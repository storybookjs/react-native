import React, { Component, ComponentType, Validator } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@storybook/components';
import { getKnobControl } from './types';
import { KnobStoreKnob } from '../KnobStore';

interface PropFormProps {
  knobs: KnobStoreKnob[];
  onFieldChange: (changedKnob: KnobStoreKnob) => void;
  onFieldClick: (knob: KnobStoreKnob) => void;
}

const InvalidType = () => <span>Invalid Type</span>;

export default class PropForm extends Component<PropFormProps> {
  static displayName = 'PropForm';

  static defaultProps = {
    knobs: [] as KnobStoreKnob[],
    onFieldChange: () => {},
    onFieldClick: () => {},
  };

  static propTypes = {
    knobs: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.any,
      })
    ).isRequired as Validator<PropFormProps['knobs']>,
    onFieldChange: PropTypes.func.isRequired as Validator<PropFormProps['onFieldChange']>,
    onFieldClick: PropTypes.func.isRequired as Validator<PropFormProps['onFieldClick']>,
  };

  makeChangeHandler(name: string, type: string) {
    const { onFieldChange } = this.props;
    return (value = '') => {
      const change: KnobStoreKnob = { name, type, value } as any;

      onFieldChange(change);
    };
  }

  render() {
    const { knobs, onFieldClick } = this.props;

    return (
      <Form>
        {knobs.map(knob => {
          const changeHandler = this.makeChangeHandler(knob.name, knob.type);
          const InputType: ComponentType<any> = getKnobControl(knob.type) || InvalidType;

          return (
            <Form.Field key={knob.name} label={!knob.hideLabel && `${knob.label || knob.name}`}>
              <InputType knob={knob} onChange={changeHandler} onClick={onFieldClick} />
            </Form.Field>
          );
        })}
      </Form>
    );
  }
}
