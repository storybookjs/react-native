import React from 'react';
import stringify from 'json-stringify-safe';

const folderStyle = {
  display: 'block',
  width: '100%',
  marginBottom: '10px',
  backgroundColor: 'white',
  transition: 'background-color .2s ease-in',
};

const folderSidebarStyle = {
  display: 'block',
  width: '10px',
  float: 'left',
  height: '100%',
  color: '#ccc',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  MozUserSelect: 'none',
  cursor: 'pointer',
};

const folderContentStyle = {
  display: 'inline-block',
  clear: 'right',
  marginLeft: '5px',
  padding: '0px',
  paddingLeft: '5px',
  width: 'auto',
};

class Foldable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
    this.onToggleCallback = this.onToggle.bind(this);
  }

  componentDidMount() {
    this.refs.folder.style.backgroundColor = '#FFFCE0';
    setTimeout(() => {
      this.refs.folder.style.backgroundColor = folderStyle.backgroundColor;
    }, 500);
  }

  onToggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    const action = { ...this.props.action };
    delete action.id;
    let content;

    if (this.state.collapsed) {
      // return the shortest string representation possible
      content = stringify(action);
    } else {
      content = stringify(action, null, 2);
    }

    return (
      <div ref="folder" style={ folderStyle }>
        <div style={ folderSidebarStyle }>
          <span ref="foldable-toggle" onClick={ this.onToggleCallback }>
            { this.state.collapsed ? '►' : '▼' }
          </span>
        </div>

        <div ref="foldable-content" style={ folderContentStyle }>
          { content }
        </div>
      </div>
      );
  }
}

Foldable.propTypes = {
  action: React.PropTypes.object,
};

export default Foldable;
