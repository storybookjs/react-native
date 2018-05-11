import PropTypes from 'prop-types';
import React from 'react';

import glamorous from 'glamorous';
import { polyfill } from 'react-lifecycles-compat';

import debounce from 'lodash.debounce';
import { baseFonts } from '@storybook/components';

const defaultTextValue = '';

const Wrapper = glamorous.div(baseFonts, {
  border: '1px solid #ECECEC',
  borderRadius: 2,
  position: 'relative',
});

const TextWrapper = glamorous.div({
  background: '#F7F7F7',
});

const Input = glamorous.input({
  fontSize: 12,
  color: '#828282',
  padding: 5,
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  border: 0,
  height: 26,
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
        <TextWrapper>
          <Input
            type="text"
            placeholder="Filter"
            name="filter-text"
            value={this.state.query || defaultTextValue}
            onChange={this.onChange}
          />
        </TextWrapper>
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
