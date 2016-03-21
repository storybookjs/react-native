import React from 'react';

const Layout = ({controls, content}) => (
  <div style={{}}>
    <div style={{width: '250px', float: 'left'}}>
      {controls}
    </div>
    <div style={{marginLeft: '250px'}}>
      {content}
    </div>
  </div>
);

export default Layout;
