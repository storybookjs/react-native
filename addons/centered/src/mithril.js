/** @jsx m */

// eslint-disable-next-line import/no-extraneous-dependencies
import m from 'mithril';

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
};

const innerStyle = {
  margin: 'auto',
};

export default function(storyFn) {
  return {
    view: () => (
      <div style={style}>
        <div style={innerStyle}>{m(storyFn())}</div>
      </div>
    ),
  };
}
