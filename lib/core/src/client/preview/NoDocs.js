import React from 'react';

const wrapper = {
  fontSize: '14px',
  letterSpacing: '0.2px',
  margin: '10px 0',
};

const main = {
  margin: 'auto',
  padding: 30,
  borderRadius: 10,
  background: 'rgba(0,0,0,0.03)',
};

const heading = {
  textAlign: 'center',
};

export const NoDocs = () => (
  <div style={wrapper} className="sb-nodocs sb-wrapper">
    <div style={main}>
      <h1 style={heading}>No Docs</h1>
      <p>
        Sorry, but there are no docs for the selected story. To add them, set the story's&nbsp;
        <code>docs</code> parameter. If you think this is an error:
      </p>
      <ul>
        <li>Please check the story definition.</li>
        <li>Please check the Storybook config.</li>
        <li>Try reloading the page.</li>
      </ul>
      <p>
        If the problem persists, check the browser console, or the terminal you've run Storybook
        from.
      </p>
    </div>
  </div>
);
