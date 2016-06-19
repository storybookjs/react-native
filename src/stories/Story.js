import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Story } from '../index';

const stories = storiesOf('Basic Usage', module);

stories.addWithInfo(
  'Basic Modal',
  `
    The \`<Story>\` component can be used to show additional information with
    your stories. To render text here, provide your markdown formatted text
    as \`info\` property. Make sure to provide the story context variable as the
    \`context\` property to automatically add titles.
  `,
  () => (
    <em>Click the "?" button on top-right corner for <span style={{textDecoration: 'underline'}}>more information</span> about this story</em>
  )
);

stories.addWithInfo(
  'Show Inline',
  `
    To show your story information immmediately after yout story elements
    set the \`showInline\` boolean property to true. This will render this text,
    source code and prop-tables (if provider). Info styles will be adjusted
    to suit and the headers will be omitted.
  `,
  () => (
    <em>You can also show story info immediately after your example</em>
  ),
  { inline: true }
);

stories.addWithInfo(
  'Prop Tables',
  `
    You can also automatically generate propType tables for components.
    If you have any custom react components in your story, prop-type
    tables will be automatically generated for them. If you need to provide
    additional components, just give an array of react components as \`propTables\`
    property to the story component.
  `,
  () => {
    const Hello = React.createClass({
      propTypes: {
        name: React.PropTypes.string,
      },
      render() {
        return <em>hello {this.props.name}</em>;
      }
    });

    const World = React.createClass({
      render() {
        return <em>hello world</em>;
      }
    });

    return (
      <Hello name={'world'}>
        <Hello name={'ninja'} />
        <World />
      </Hello>
    );
  },
  { inline: true }
);
