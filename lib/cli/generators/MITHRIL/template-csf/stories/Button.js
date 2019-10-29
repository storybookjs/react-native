/** @jsx m */

import m from 'mithril';

const style = {
  border: '1px solid #eee',
  borderRadius: '3px',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: '15px',
  padding: '3px 10px',
  margin: '10px',
};

const Button = {
  view: vnode => (
    <button type="button" style={style} {...vnode.attrs}>
      {vnode.children}
    </button>
  ),
};

export default Button;
