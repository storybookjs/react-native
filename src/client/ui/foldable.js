import React from 'react';

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

    this.state = { collapsed: true };

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
    let content = this.props.children;

    if (this.state.collapsed) {
      // return the shortest string representation possible
      content = JSON.stringify(JSON.parse(content));
    }

    return (
      <div ref="folder" style={ folderStyle }>
        <div style={ folderSidebarStyle } onClick={ this.onToggleCallback }>
        { this.state.collapsed ? '►' : '▼' }
        </div>

        <div style={ folderContentStyle }>
          { content }
        </div>
      </div>
      );
  }
}

Foldable.propTypes = {
  children: React.PropTypes.string,
};

export default Foldable;
