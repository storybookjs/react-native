import React from 'react';
import stringify from 'json-stringify-safe';
import highlight from '../../libs/highlight';

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

const countStyle = {
  display: 'inline-block',
  float: 'left',
  marginTop: '-1px',
  marginRight: '5px',
  backgroundColor: '#777777',
  color: '#ffffff',
  padding: '1px 5px',
  borderRadius: '8px',
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
      content = stringify(action.data);
    } else {
      content = stringify(action.data, null, 2);
    }

    return (
      <div ref="folder" style={ folderStyle }>
        { action.count > 1 && <span style={ countStyle }>{ action.count }</span> }
        <div style={ folderSidebarStyle }>
          <span ref="foldable-toggle" onClick={ this.onToggleCallback }>
            { this.state.collapsed ? '►' : '▼' }
          </span>
        </div>
        <div ref="foldable-content" style={ folderContentStyle }
          dangerouslySetInnerHTML={ { __html: highlight(content) } }
        >
        </div>
      </div>
      );
  }
}

Foldable.propTypes = {
  action: React.PropTypes.object,
};

export default Foldable;
