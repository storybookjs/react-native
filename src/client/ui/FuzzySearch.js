import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Fuse from 'fuse.js';
import { getSyncedStore } from '../';

const syncedStore = getSyncedStore();

const searchBoxStyle = {
  border: '1px solid #eee',
  borderRadius: 2,
  padding: '8px 10px',
  lineHeight: '24px',
  width: '100%',
  outline: 'none',
  fontSize: 20,
  fontFamily: 'inherit',
  color: '#666',
  boxSizing: 'border-box',
  transition: 'border .2s ease',
};

const searchBoxWrapper = {
  padding: '4px',
  boxShadow: '0 4px 15px 4px rgba(0,0,0,0.2)',
  borderRadius: 2,
  backgroundColor: '#ffffff',
  marginTop: '50px',
};

const resultsStyle = {
  backgroundColor: '#fff',
  position: 'relative',
  padding: '12px',
  borderTop: '1px solid #eee',
  color: '#666',
  fontSize: 14,
};

const selectedResultStyle = {
  backgroundColor: '#f9f9f9',
  position: 'relative',
  padding: '12px',
  borderTop: '1px solid #eee',
  color: '#666',
  fontSize: 14,
};

const resultsWrapperStyle = {
  width: '100%',
  boxShadow: '0px 12px 30px 2px rgba(0, 0, 0, 0.1)',
  border: '1px solid #eee',
  borderTop: 0,
  boxSizing: 'border-box',
};

const kindStyle = {
  float: 'right',
  color: '#bbb',
  fontStyle: 'italic',
};

function mainDivStyle(width) {
  return {
    width,
    position: 'fixed',
    left: '50%',
    marginLeft: -(width / 2),
    zIndex: 99,
  };
}

export default class FuzzySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      selectedIndex: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.fuse = new Fuse(props.list, props.options);
  }

  componentWillReceiveProps(newProps) {
    this.fuse.set(newProps.list);
  }

  getResultsTemplate() {
    return this.state.results.map((val, i) => {
      const style = this.state.selectedIndex === i ? selectedResultStyle : resultsStyle;
      return (
        <div key={i} style={style}>{val.story}
          <span style={kindStyle}>in {val.kind}</span>
        </div>
      );
    });
  }

  handleKeyPress(e) {
    if (e.keyCode === 40 && (this.state.selectedIndex < this.state.results.length - 1)) {
      this.setState({
        selectedIndex: this.state.selectedIndex + 1,
      });
    } else if (e.keyCode === 38 && (this.state.selectedIndex > 0)) {
      this.setState({
        selectedIndex: this.state.selectedIndex - 1,
      });
    } else if (e.keyCode === 13) {
      const selected = this.state.results[this.state.selectedIndex];
      this.props.onSelect(selected.kind, selected.story);
      this.setState({
        results: [],
        selectedIndex: 0,
      }, () => {
        this.refs.searchBox.value = '';
        const newData = { ...syncedStore.getData() };
        newData.showSearchBox = false;
        syncedStore.setData(newData);
      });
    }
  }

  handleChange() {
    this.setState({
      results: this.fuse.search(this.refs.searchBox.value),
    });
  }

  render() {
    const {
      className,
      width,
      placeholder,
    } = this.props;

    const mainClass = classNames('react-fuzzy-search', className);

    const showSearchBox = syncedStore.getData().showSearchBox;

    return (
      <span>
        {showSearchBox &&
        <div className={mainClass} style={ mainDivStyle(width) } onKeyDown={this.handleKeyPress}>
          <div style={searchBoxWrapper}>
            <input
              type="text"
              className="searchBox"
              style={searchBoxStyle}
              onChange={this.handleChange}
              ref="searchBox"
              placeholder={placeholder}
              autoFocus
            />
          </div>
          {
            this.state.results && this.state.results.length > 0 &&
            <div style={resultsWrapperStyle}>
              {this.getResultsTemplate()}
            </div>
          }
        </div>}
      </span>
    );
  }
}

FuzzySearch.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  width: PropTypes.number,
  list: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
};

FuzzySearch.defaultProps = {
  width: 430,
};

export default FuzzySearch;
