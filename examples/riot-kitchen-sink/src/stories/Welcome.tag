<welcome>
  <div class="main">
    <h1>Welcome to Storybook for riot.js</h1>
    <p>
      This is a UI component dev environment for your riot app.
    </p>
    <p>
      We've added some basic stories inside the
      <code class="code">src/stories</code>
      directory.
      <br />
      A story is a single state of one or more UI components.
      You can have as many stories as you want.
      <br />
      (Basically a story is like a visual test case.)
    </p>
    <p>
      See these sample
      <a class="link" onclick= { goToButton }>stories</a>
      for a component called
      <code class="code">Button</code>
      .
    </p>
    <p style="text-align:center"><img src="../logo.png" /></p>
    <p>
      Just like that, you can add your own components as stories.
      <br />
      You can also edit those components and see changes right away.
      <br />
      (Try editing the <code class="code">Button</code> component
      located at <code class="code">src/stories/Button.tag</code>.)
    </p>
    <p>
      Usually we create stories with smaller UI components in the app.<br />
      Have a look at the
      <a
        class="link"
        href="https://storybook.js.org/basics/writing-stories"
        target="_blank"
      >
        Writing Stories
      </a>
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

<script>
    this.goToButton = this.opts.goToButton || function () {}
</script>

<style>
  .main {
    padding: 15px;
    line-height: 1.4;
    font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
    background-color: #ffffff;
  }

  .logo {
    width: 200;
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

  .codeBlock {
    background-color: #f3f2f2;
    padding: 1px 10px;
    margin: 10px 0;
  }

  .note {
    opacity: 0.5;
  }
</style>

</welcome>