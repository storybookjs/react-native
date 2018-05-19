import { document } from 'global';
import PropTypes from 'prop-types';
import React from 'react';
import { SketchPicker } from 'react-color';
import debounce from 'lodash.debounce';

const conditionalRender = (condition, positive, negative) => (condition ? positive() : negative());

const styles = {
  swatch: {
    background: '#fff',
    borderRadius: '1px',
    border: '1px solid rgb(247, 244, 244)',
    display: 'inline-block',
    cursor: 'pointer',
    width: '100%',
    padding: 0,
  },
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
};

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
    this.onChange.cancel();
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
      width: 'auto',
      height: '20px',
      borderRadius: '2px',
      margin: 5,
      background: knob.value,
    };
    return (
      <div id={knob.name}>
        <button type="button" style={styles.swatch} onClick={this.handleClick}>
          <div style={colorStyle} />
        </button>
        {conditionalRender(
          displayColorPicker,
          () => (
            <div
              style={styles.popover}
              ref={e => {
                this.popover = e;
              }}
            >
              <SketchPicker color={value} onChange={this.handleChange} />
            </div>
          ),
          () => null
        )}
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
