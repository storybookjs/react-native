import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Story from '../index';

const stories = storiesOf('<Story />', module);

stories.add('Basic Usage', function (context) {
  const info = `
    The \`<Story>\` component can be used to show additional information with
    your stories. To render text here, provide your markdown formatted text
    as \`info\` property. Make sure to provide the story context variable as the
    \`context\` property to automatically add titles.
  `;

  return (
    <Story context={context} info={info}>
      <em>Click the "?" button on top-right corner for more info</em>
    </Story>
  );
});

stories.add('Inline Info', function (context) {
  const info = `
    To show your story information immmediately after yout story elements
    set the \`inline\` boolean property to true. This will render this text,
    source code and prop-tables (if provider). Info styles will be adjusted
    to suit and the headers will be omitted.
  `;

  return (
    <Story context={context} info={info} inline={true}>
      <em>You can also show story info after your example</em>
    </Story>
  );
});

stories.add('Prop Tables', function (context) {
  const info = `
    You can also automatically generate propType tables for components.
    Just provide an array of react components as \`propTables\` property
    to the story component.
  `;

  return (
    <Story context={context} propTables={[Story]} info={info}>
      <em>Click the "?" button on top-right corner for more info</em>
    </Story>
  );
});

stories.add('Source Code', function (context) {
  const info = `
    You can see the JSX source code of your component as well.
  `;

  class Container extends React.Component {
    render() {
      return (<div style={{ backgroundColor: this.props.color }}>
        {this.props.children}
      </div>);
    }
  }

  return (
    <Story context={context} info={info}>
      This component contains several child components
      <br />
      <br />
      <Container>
        <strong>This is one</strong>
      </Container>
      <div style={{ padding: 20 }}>
        <Container color="rgb(247, 247, 247)">
          <div>This is another</div>
        </Container>
      </div>
      <em>Click the "?" button on top-right corner for more info</em>
    </Story>
  );
});
