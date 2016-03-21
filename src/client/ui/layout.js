import React from 'react';

class Layout extends React.Component {
  render() {
    const {controls, content} = this.props;
    const {height} = this.state;

    const rootStyles = {
      height
    };
    const controlsStyle = {
      width: '240px',
      float: 'left',
      height: '100%',
      overflowY: 'auto',
      // borderRight: '3px solid #DDD',
    };
    const contentStyle = {
      height,
      marginLeft: '250px',
      border: '1px solid #DDD',
      borderRadius: '4px',
      boxShadow: '0px 2px 6px -1px #b8b8b8'
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
    height -= 20;
    this.setState({height});
  }
}

export default Layout;
