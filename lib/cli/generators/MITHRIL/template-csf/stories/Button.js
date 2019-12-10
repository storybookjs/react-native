/** @jsx m */

import m from 'mithril';

const style = {
  border: '1px solid #eee',
  borderRadius: 3,
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  fontSize: 15,
  padding: '3px 10px',
  margin: 10,
};

const Button = {
  view: vnode => (
    <button type="button" style={style} {...vnode.attrs}>
      {vnode.children}
    </button>
  ),
};

export default Button;
