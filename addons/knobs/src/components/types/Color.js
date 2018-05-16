import { document } from 'global';
import PropTypes from 'prop-types';
import React from 'react';
import { SketchPicker } from 'react-color';

import styled from 'react-emotion';
import debounce from 'lodash.debounce';

const SwatchButton = styled('button')({
  background: '#fff',
  borderRadius: '1px',
  border: '1px solid rgb(247, 244, 244)',
  display: 'inline-block',
  cursor: 'pointer',
  width: '100%',
  padding: 0,
});
const Swatch = styled('div')({
  width: 'auto',
  height: '20px',
  borderRadius: '2px',
  margin: 5,
});
const Popover = styled('div')({
  position: 'absolute',
  zIndex: '2',
});

class ColorType extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      displayColorPicker: false,
      value: props.knob.value,
    };

    this.onChange = debounce(props.onChange, 200);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleWindowMouseDown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleWindowMouseDown);
  }

  handleWindowMouseDown = e => {
    if (!this.state.displayColorPicker) return;
    if (this.popover.contains(e.target)) return;

    this.setState({
      displayColorPicker: false,
    });
  };

  handleClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  };

  handleChange = color => {
    this.setState({
      value: color,
    });

    this.onChange(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
  };

  render() {
    const { knob } = this.props;
    const { displayColorPicker, value } = this.state;
    const colorStyle = {
      background: knob.value,
    };

    return (
      <div id={knob.name}>
        <SwatchButton type="button" onClick={this.handleClick}>
          <Swatch style={colorStyle} />
        </SwatchButton>
        {displayColorPicker ? (
          <Popover
            innerRef={e => {
              this.popover = e;
            }}
          >
            <SketchPicker color={value} onChange={this.handleChange} />
          </Popover>
        ) : null}
      </div>
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
