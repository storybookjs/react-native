import React from 'react';
import { SketchPicker } from 'react-color';

const styles = {
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    border: '1px solid rgb(247, 244, 244)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    top: 0,
    right: 0,
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
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWindowMouseDown = this.onWindowMouseDown.bind(this);
    this.mouseDownInColorPicker = false;
    this.state = {
      displayColorPicker: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.displayColorPicker !== prevState.displayColorPicker) {
      document[this.state.displayColorPicker
        ? 'addEventListener'
        : 'removeEventListener']('mousedown', this.onWindowMouseDown);
      document[this.state.displayColorPicker
        ? 'addEventListener'
        : 'removeEventListener']('touchstart', this.onWindowMouseDown);
    }
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onWindowMouseDown);
    document.removeEventListener('touchstart', this.onWindowMouseDown);
  }

  onWindowMouseDown() {
    if (this.mouseIsDownOnCalendar) {
      return;
    }
    this.setState({
      displayColorPicker: false,
    });
  }

  onMouseDown() {
    this.mouseDownInColorPicker = true;
  }

  onMouseUp() {
    this.mouseDownInColorPicker = false;
  }

  handleClick() {
    this.mouseDownInColorPicker = true;
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    });
  }

  render() {
    const { knob, onChange } = this.props;
    const colorStyle = {
      width: '300px',
      height: '14px',
      borderRadius: '2px',
      background: knob.value,
    };
    return (
      <div id={knob.name}>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ colorStyle } />
        </div>
        { this.state.displayColorPicker ? (
          <div style={ styles.popover } onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
            <SketchPicker color={ knob.value } onChange={ color => onChange(color.hex) } />
          </div>
        ) : null }
      </div>
    );
  }
}

ColorType.propTypes = {
  knob: React.PropTypes.object,
  onChange: React.PropTypes.func,
};

ColorType.serialize = function (value) {
  return value;
};

ColorType.deserialize = function (value) {
  return value;
};

export default ColorType;
