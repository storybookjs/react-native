import React from 'react';
import { SketchPicker } from 'react-color';

const styles = {
  swatch: {
    padding: '5px',
    background: '#fff',
    borderRadius: '1px',
    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
    display: 'inline-block',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    right: 0,
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
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

const triggerClassName = 'color-picker-switch';

class ColorType extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      displayColorPicker: false,
    };
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose(e) {
    if (e.target.className !== triggerClassName) return;
    this.setState({ displayColorPicker: false });
  }

  render() {
    const { knob, onChange } = this.props;
    const colorStyle = {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
      background: knob.value,
    };
    return (
      <div id={knob.name}>
        <div style={ styles.swatch } onClick={ this.handleClick } className={triggerClassName}>
          <div style={ colorStyle } />
        </div>
        { this.state.displayColorPicker ? (
          <div style={ styles.modal } onClick={ this.handleClose } className={triggerClassName}>
            <div style={ styles.popover }>
              <SketchPicker color={ knob.value } onChange={ color => onChange(color.hex) } />
            </div>
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
