import React, { Component, WeakValidationMap, ComponentType, Requireable } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@storybook/components';
import TypeMap from './types';
import { KnobStoreKnob } from '../KnobStore';

interface PropFormProps {
  knobs: KnobStoreKnob[];
  onFieldChange: Function;
  onFieldClick: Function;
}

const InvalidType = () => <span>Invalid Type</span>;

export default class PropForm extends Component<PropFormProps> {
  static displayName = 'PropForm';

  static defaultProps = {
    knobs: [] as KnobStoreKnob[],
  };

  static propTypes: WeakValidationMap<PropFormProps> = {
    // TODO: remove `any` once DefinitelyTyped/DefinitelyTyped#31280 has been resolved
    knobs: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.any,
      })
    ).isRequired as Requireable<any[]>,
    onFieldChange: PropTypes.func.isRequired,
    onFieldClick: PropTypes.func.isRequired,
  };

  makeChangeHandler(name: string, type: string) {
    const { onFieldChange } = this.props;
    return (value = '') => {
      const change = { name, type, value };

      onFieldChange(change);
    };
  }

  render() {
    const { knobs, onFieldClick } = this.props;

    return (
      <Form>
        {knobs.map(knob => {
          const changeHandler = this.makeChangeHandler(knob.name, knob.type);
          const InputType: ComponentType<any> = TypeMap[knob.type] || InvalidType;

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
