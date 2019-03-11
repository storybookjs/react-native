import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'storybook-welcome-component',
  template: `
    <main>
      <h1>Welcome to storybook</h1>
      <p>This is a UI component dev environment for your app.</p>
      <p>
        We've added some basic stories inside the
        <span class="inline-code">src/stories</span> directory. <br />
        A story is a single state of one or more UI components. You can have as many stories as you
        want. <br />
        (Basically a story is like a visual test case.)
      </p>
      <p>
        See these sample
        <a (click)="showApp.emit($event)" role="button" tabIndex="0">stories</a> for a component
        called <span class="inline-code">Button</span> .
      </p>
      <p>
        Just like that, you can add your own components as stories. <br />
        You can also edit those components and see changes right away. <br />
        (Try editing the <span class="inline-code">Button</span> stories located at
        <span class="inline-code">src/stories/index.js</span>.)
      </p>
      <p>
        Usually we create stories with smaller UI components in the app.<br />
        Have a look at the
        <a
          href="https://storybook.js.org/basics/writing-stories"
          target="_blank"
          rel="noopener noreferrer"
        >
          Writing Stories
        </a>
        section in our documentation.
      </p>
      <p class="note">
        <b>NOTE:</b> <br />
        Have a look at the <span class="inline-code">.storybook/webpack.config.js</span> to add
        webpack loaders and plugins you are using in this project.
      </p>
    </main>
  `,
  styles: [
    `
      main {
        padding: 15px;
        line-height: 1.4;
        fontfamily: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans, sans-serif;
        background-color: #ffffff;
      }

      .note {
        opacity: 0.5;
      }

      .inline-code {
        font-size: 15px;
        font-weight: 600;
        padding: 2px 5px;
        border: 1px solid #eae9e9;
        border-radius: 4px;
        background-color: #f3f2f2;
        color: #3a3a3a;
      }

      a {
        color: #1474f3;
        text-decoration: none;
        border-bottom: 1px solid #1474f3;
        padding-bottom: 2px;
      }
    `,
  ],
})
export default class WelcomeComponent {
  @Output()
  showApp = new EventEmitter<any>();
}
