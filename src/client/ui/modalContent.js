import React from 'react';

const commandStyle = {
  backgroundColor: '#eee',
  padding: '2px 6px',
  borderRadius: 2,
  lineHeight: '36px',
  marginRight: '5px',
};

const h4Style = {
  marginTop: 0,
  textAlign: 'center',
};

export default function modalContent() {
  return (
    <div>
      <h4 style={h4Style}>Keyboard Shortcuts</h4>
          <div>
            <b style={commandStyle}>&#8984; &#8679; O</b> / &nbsp;
            <b style={commandStyle}>&#8963; &#8679; O</b>
            Open Searchbox
          </div>
          <div>
            <b style={commandStyle}>&#8984; &#8679; L</b> / &nbsp;
            <b style={commandStyle}>&#8963; &#8679; L</b>
            Toggle SideBar
          </div>
          <div>
            <b style={commandStyle}>&#8984; &#8679; B</b> / &nbsp;
            <b style={commandStyle}>&#8963; &#8679; B</b>
            Toggle Action Logger
          </div>
    </div>
  );
}
