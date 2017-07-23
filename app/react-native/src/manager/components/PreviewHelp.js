import React from 'react';

const styles = {
  main: {
    margin: 15,
    maxWidth: 600,
    lineHeight: 1.4,
    fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
  },

  code: {
    fontSize: 15,
    fontWeight: 600,
    padding: '2px 5px',
    border: '1px solid #eae9e9',
    borderRadius: 4,
    backgroundColor: '#f3f2f2',
    color: '#3a3a3a',
  },

  codeBlock: {
    backgroundColor: '#f3f2f2',
    padding: '1px 10px',
    margin: '10px 0',
  },
};

const PreviewHelp = () =>
  <div style={styles.main}>
    <h1>Welcome to storybook</h1>
    <p>This is a UI component dev environment for your app.</p>
    <p>
      We've added some basic stories inside the <span style={styles.code}>
        storybook/stories
      </span>{' '}
      directory. A story is a single state of one or more UI components. You can have as many
      stories as you want. Basically a story is like a visual test case.
    </p>
    <p>
      To see your Storybook stories on the device, you should start your mobile app for the{' '}
      <span style={styles.code}>&lt;platform&gt;</span> of your choice (typically ios or android).
      (Note that due to an implementation detail, your stories will only show up in the left-pane
      after your device has connected to this storybook server.)
    </p>
    <p>
      For <span style={styles.code}>create-react-native-app</span> apps:
    </p>
    <div style={styles.codeBlock}>
      <pre style={styles.instructionsCode}>npm run &lt;platform&gt;</pre>
    </div>
    <p>
      For <span style={styles.code}>react-native init</span> apps:
    </p>
    <div style={styles.codeBlock}>
      <pre style={styles.instructionsCode}>npm run &lt;platform&gt;</pre>
    </div>
  </div>;

export { PreviewHelp as default };
