import React from 'react';

const addonStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default {
  test1: {
    title: 'Test 1',
    render() { return <div style={addonStyle}>I</div> },
  },
  test2: {
    title: 'Test 2',
    render() { return <div style={addonStyle}>II</div> },
  },
  test3: {
    title: 'Test 3',
    render() { return <div style={addonStyle}>III</div> },
  },
  test4: {
    title: 'Test 4',
    render() { return <div style={addonStyle}>IV</div> },
  },
}
