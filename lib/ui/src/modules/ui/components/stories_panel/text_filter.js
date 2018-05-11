import PropTypes from 'prop-types';
import React from 'react';

import glamorous from 'glamorous';
import { polyfill } from 'react-lifecycles-compat';

import debounce from 'lodash.debounce';
import { baseFonts } from '@storybook/components';

const defaultTextValue = '';

const Wrapper = glamorous.div(baseFonts, {
  position: 'relative',
});

const Input = glamorous.input({
  fontSize: 12,
  color: '#828282',
  padding: 5,
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  height: 26,
  background: 'rgba(255,255,255,0.99)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  outline: 'none',
  borderRadius: 2,
});

const ClearButton = glamorous.button({
  position: 'absolute',
  backgroundColor: 'transparent',
  color: '#868686',
  border: 'none',
  width: 25,
  height: 26,
  right: 1,
  top: 0,
  textAlign: 'center',
  cursor: 'pointer',
  lineHeight: '23px',
  fontSize: 20,
});

const debounceFilterChangeTimeout = 500;

class TextFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.fireOnClear = this.fireOnClear.bind(this);
    this.changeFilter = debounce(this.changeFilter, debounceFilterChangeTimeout);
  }

  onChange(event) {
    const text = event.target.value;
    this.setState({ query: text });
    this.changeFilter(text);
  }

  fireOnClear() {
    this.setState({ query: defaultTextValue });
    const { onClear } = this.props;
    if (onClear) onClear();
  }

  changeFilter(text) {
    const { onChange } = this.props;
    if (onChange) onChange(text);
  }

  render() {
    return (
      <Wrapper>
        <Input
          type="text"
          placeholder="Filter"
          name="filter-text"
          value={this.state.query || defaultTextValue}
          onChange={this.onChange}
        />
        {this.state.query &&
          this.state.query.length && (
            <ClearButton onClick={this.fireOnClear} className="clear">
              ×
            </ClearButton>
          )}
      </Wrapper>
    );
  }
}

TextFilter.getDerivedStateFromProps = ({ text }, { prevText }) => {
  if (text !== prevText) {
    return {
      query: text,
      prevText: text,
    };
  }
  return null;
};

TextFilter.defaultProps = {
  text: defaultTextValue,
  onChange: null,
  onClear: null,
};

TextFilter.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  text: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};

polyfill(TextFilter);

export default TextFilter;
