import React from 'react';

class Layout extends React.Component {
  render() {
    const {controls, content} = this.props;
    const {height} = this.state;

    const rootStyles = {
      height,
      padding: '8px',
      backgroundColor: '#F7F7F7'
    };
    const controlsStyle = {
      width: '240px',
      float: 'left',
      height: '100%',
      overflowY: 'auto'
    };
    const contentStyle = {
      height: height - 15,
      marginLeft: '250px',
      border: '1px solid #DDD',
      borderRadius: '4px',
      boxShadow: '0px 2px 6px -1px #b8b8b8',
      padding: '5px',
      backgroundColor: '#FFF'
    };

    return (
      <div style={rootStyles}>
        <div style={controlsStyle}>
          {controls}
        </div>
        <div style={contentStyle}>
          {content}
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.updateHeight();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateHeight.bind(this));
  }

  updateHeight() {
    const {documentElement, body} = document;
    let height = documentElement.clientHeight|| body.clientHeight;
    height -= 15;
    this.setState({height});
  }
}

export default Layout;
