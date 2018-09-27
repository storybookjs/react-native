import { document } from 'global';
import PropTypes from 'prop-types';
import React from 'react';
import { SketchPicker } from 'react-color';

import styled from '@emotion/styled';

import { Button } from '@storybook/components';

const Swatch = styled.div({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 3,
  width: 28,
});
const Popover = styled.div({
  position: 'absolute',
  zIndex: '2',
});

class ColorType extends React.Component {
  state = {
    displayColorPicker: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleWindowMouseDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { knob } = this.props;
    const { displayColorPicker } = this.state;

    return (
      nextProps.knob.value !== knob.value || nextState.displayColorPicker !== displayColorPicker
    );
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleWindowMouseDown);
  }

  handleWindowMouseDown = e => {
    const { displayColorPicker } = this.state;
    if (!displayColorPicker || this.popover.contains(e.target)) {
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

  handleChange = color => {
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
      <Button type="button" onClick={this.handleClick} size="flex">
        {knob.value}
        <Swatch style={colorStyle} />
        {displayColorPicker ? (
          <Popover
            innerRef={e => {
              this.popover = e;
            }}
          >
            <SketchPicker color={knob.value} onChange={this.handleChange} />
          </Popover>
        ) : null}
      </Button>
    );
  }
}

ColorType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
  }),
  onChange: PropTypes.func,
};
ColorType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ColorType.serialize = value => value;
ColorType.deserialize = value => value;

export default ColorType;
