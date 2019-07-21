import { document } from 'global';
import PropTypes from 'prop-types';
import React, { Component, Validator } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

import { styled } from '@storybook/theming';
import { Form } from '@storybook/components';
import { KnobControlConfig, KnobControlProps } from './types';

type ColorTypeKnobValue = string;
export type ColorTypeKnob = KnobControlConfig<ColorTypeKnobValue>;
type ColorTypeProps = KnobControlProps<ColorTypeKnobValue>;

interface ColorTypeState {
  displayColorPicker: boolean;
}

interface ColorButtonProps {
  name: string;
  type: string;
  size: string;
  active: boolean;
  onClick: () => any;
}

const { Button } = Form;

const Swatch = styled.div<{}>(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: 6,
  width: 16,
  height: 16,
  boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  borderRadius: '1rem',
}));

const ColorButton = styled(Button)<ColorButtonProps>(({ active }) => ({
  zIndex: active ? 3 : 'unset',
}));

const Popover = styled.div({
  position: 'absolute',
  zIndex: 2,
});

export default class ColorType extends Component<ColorTypeProps, ColorTypeState> {
  static propTypes = {
    knob: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }) as Validator<ColorTypeProps['knob']>,
    onChange: PropTypes.func as Validator<ColorTypeProps['onChange']>,
  };

  static defaultProps: ColorTypeProps = {
    knob: {} as any,
    onChange: value => value,
  };

  static serialize = (value: ColorTypeKnobValue) => value;

  static deserialize = (value: ColorTypeKnobValue) => value;

  state: ColorTypeState = {
    displayColorPicker: false,
  };

  popover!: HTMLDivElement;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleWindowMouseDown);
  }

  shouldComponentUpdate(nextProps: ColorTypeProps, nextState: ColorTypeState) {
    const { knob } = this.props;
    const { displayColorPicker } = this.state;

    return (
      nextProps.knob.value !== knob.value || nextState.displayColorPicker !== displayColorPicker
    );
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleWindowMouseDown);
  }

  handleWindowMouseDown = (e: MouseEvent) => {
    const { displayColorPicker } = this.state;
    if (!displayColorPicker || this.popover.contains(e.target as HTMLElement)) {
      return;
    }

    this.setState({
      displayColorPicker: false,
    });
  };

  handleClick = () => {
    const { displayColorPicker } = this.state;

    this.setState({
      displayColorPicker: !displayColorPicker,
    });
  };

  handleChange = (color: ColorResult) => {
    const { onChange } = this.props;

    onChange(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
  };

  render() {
    const { knob } = this.props;
    const { displayColorPicker } = this.state;
    const colorStyle = {
      background: knob.value,
    };
    return (
      <ColorButton
        active={displayColorPicker}
        type="button"
        name={knob.name}
        onClick={this.handleClick}
        size="flex"
      >
        {knob.value && knob.value.toUpperCase()}
        <Swatch style={colorStyle} />
        {displayColorPicker ? (
          <Popover
            ref={e => {
              if (e) this.popover = e;
            }}
          >
            <SketchPicker color={knob.value} onChange={this.handleChange} />
          </Popover>
        ) : null}
      </ColorButton>
    );
  }
}
