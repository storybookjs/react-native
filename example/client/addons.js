import React from 'react';

const style = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export default {
  test1: {
    title: 'Test 1',
    getPanel: () => <div style={style}>I</div>,
  },
  test2: {
    title: 'Test 2',
    getPanel: () => <div style={style}>II</div>,
  },
  test3: {
    title: 'Test 3',
    getPanel: () => <div style={style}>III</div>,
  },
  test4: {
    title: 'Test 4',
    getPanel: () => <div style={style}>IV</div>,
  },
}
