import PropTypes from 'prop-types';
import React from 'react';
import Textarea from 'react-textarea-autosize';
import debounce from 'lodash.debounce';

const styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555',
  fontFamily: 'monospace',
};

class ObjectType extends React.Component {
  constructor(props, context) {
    super(props, context);

    try {
      this.state = {
        value: JSON.stringify(props.knob.value, null, 2),
        failed: false,
      };
    } catch (e) {
      this.state = {
        // if it can't be JSON stringified, it's probably some weird stuff
        value: 'Default object cannot not be JSON stringified',
        failed: true,
      };
    }

    this.onChange = debounce(props.onChange, 200);
  }

  componentWillUnmount() {
    this.onChange.cancel();
  }

  handleChange = e => {
    const { value } = e.target;

    try {
      const json = JSON.parse(e.target.value.trim());
      this.onChange(json);
      this.setState({
        value,
        failed: false,
      });
    } catch (err) {
      this.setState({
        value,
        failed: true,
      });
    }
  };

  render() {
    const { knob } = this.props;
    const { value, failed } = this.state;
    const extraStyle = {};

    if (failed) {
      extraStyle.border = '1px solid #fadddd';
      extraStyle.backgroundColor = '#fff5f5';
    }

    return (
      <Textarea
        id={knob.name}
        style={{ ...styles, ...extraStyle }}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

ObjectType.defaultProps = {
  knob: {},
  onChange: value => value,
};

ObjectType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }),
  onChange: PropTypes.func,
};

ObjectType.serialize = object => JSON.stringify(object);
ObjectType.deserialize = value => (value ? JSON.parse(value) : {});

export default ObjectType;
