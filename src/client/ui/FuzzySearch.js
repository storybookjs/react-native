import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Fuse from 'fuse.js';

const searchBoxStyle = {
  border: '1px solid #eee',
  borderRadius: 2,
  padding: '8px 10px',
  lineHeight: '24px',
  width: '100%',
  outline: 'none',
  fontSize: 20,
  fontFamily: 'Lato',
  color: '#666',
  boxSizing: 'border-box',
};

const searchBoxWrapper = {
  padding: '4px',
  boxShadow: '0 4px 15px 4px rgba(0,0,0,0.2)',
  borderRadius: 2,
  backgroundColor: '#ffffff',
};

const resultsStyle = {
  backgroundColor: '#fff',
  position: 'relative',
  padding: '12px',
  borderTop: '1px solid #eee',
  color: '#666',
  fontFamily: 'Lato',
  fontSize: 14,
};

const selectedResultStyle = {
  backgroundColor: '#f9f9f9',
  position: 'relative',
  padding: '12px',
  borderTop: '1px solid #eee',
  color: '#666',
  fontFamily: 'Lato',
  fontSize: 14,
};

const resultsWrapperStyle = {
  width: '100%',
  boxShadow: '0px 12px 30px 2px rgba(0, 0, 0, 0.1)',
  border: '1px solid #eee',
  borderTop: 0,
  boxSizing: 'border-box',
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

  getResultsTemplate() {
    return this.state.results.map((val, i) => {
      const style = this.state.selectedIndex === i ? selectedResultStyle : resultsStyle;
      return <div key={i} style={style}>{val.title}</div>;
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
      this.props.onSelect(this.state.results[this.state.selectedIndex]);
      this.setState({
        results: [],
        selectedIndex: 0,
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
    } = this.props;

    const mainClass = classNames('react-fuzzy-search', className);

    return (
      <div className={mainClass} style={ mainDivStyle(width) } onKeyDown={this.handleKeyPress}>
        <div style={searchBoxWrapper}>
          <input type="text" style={searchBoxStyle} onChange={this.handleChange} ref="searchBox" />
        </div>
        {
          this.state.results && this.state.results.length > 0 &&
          <div style={resultsWrapperStyle}>
            {this.getResultsTemplate()}
          </div>
        }
      </div>
    );
  }
}

FuzzySearch.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  width: PropTypes.number,
  list: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
};

FuzzySearch.defaultProps = {
  width: 430,
};

export default FuzzySearch;
