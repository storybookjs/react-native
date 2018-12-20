<div class="main">
  <h1>Welcome to Storybook for Svelte</h1>
  <p>
    This is a UI component dev environment for your svelte app.
  </p>
  <p>
    We've added some basic stories inside the <code class="code">src/stories</code> directory.
    <strong>A story is like a visual test case</strong>
    and represents a single state of one or more UI components.
    You can have as many stories as you want.
  </p>

  <h1 class="logo">Svelte</h1>

  <p>
    Just like that, you can add your own components as stories.
    You can also edit those components and see changes right away.
    <br />
    (Try editing the <code class="code">Button</code> component
    located at <code class="code">src/stories/views/Welcome.svelte</code>.)
  </p>
  <p>
    Usually we create stories with smaller UI components in the app.<br />
    Have a look at the
    <a
      class="link"
      href="https://storybook.js.org/basics/writing-stories"
      target="_blank"
    >Writing Stories</a>
    section in our documentation.
  </p>
  <p class="note">
    <b>NOTE:</b>
    <br />
    Have a look at the
    <code class="code">.storybook/webpack.config.js</code>
    to add webpack
    loaders and plugins you are using in this project.
  </p>
</div>

<style>
  @import url('https://fonts.googleapis.com/css?family=Rajdhani');

  .main {
    margin: 15px;
    max-width: 600;
    line-height: 1.4;
    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
  }

  .logo {
    font-family: 'Rajdhani', sans-serif;
    color: rgb(170,30,30);
    font-weight: 300;
    font-size: 8rem;
    text-align: center;
    margin: 0;
  }

  .link {
    color: #1474f3;
    text-decoration: none;
    border-bottom: 1px solid #1474f3;
    padding-bottom: 2px;
  }

  .code {
    font-size: 15;
    font-weight: 600;
    padding: 2px 5px;
    border: 1px solid #eae9e9;
    border-radius: 4px;
    background-color: #f3f2f2;
    color: #3a3a3a;
  }

  .note {
    opacity: 0.5;
  }
</style>
