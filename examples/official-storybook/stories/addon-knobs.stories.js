import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  withKnobs,
  withKnobsOptions,
  text,
  number,
  boolean,
  color,
  select,
  array,
  date,
  button,
  object,
} from '@storybook/addon-knobs/react';

class AsyncItemLoader extends React.Component {
  constructor() {
    super();
    this.state = { items: [] };
  }

  handleLoadItems() {
    this.setState({
      isLoading: true,
      items: [],
    });
    setTimeout(() => this.setState({ items: ['pencil', 'pen', 'eraser'], isLoading: false }), 1500);
  }

  render() {
    // this existing example seems like a react anti-pattern?
    // perhaps for testing purposes only?
    button('Load the items', () => this.handleLoadItems());

    const { isLoading, items } = this.state;

    if (isLoading) {
      return <p>Loading data</p>;
    } else if (!items.length) {
      return <p>No items loaded</p>;
    }
    return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
  }
}

storiesOf('Addon Knobs.withKnobs', module)
  .addDecorator(withKnobs)
  .add('tweaks static values', () => {
    const name = text('Name', 'Storyteller');
    const age = number('Age', 70, { range: true, min: 0, max: 90, step: 5 });
    const fruits = {
      apple: 'Apple',
      banana: 'Banana',
      cherry: 'Cherry',
    };
    const fruit = select('Fruit', fruits, 'apple');
    const dollars = number('Dollars', 12.5, { min: 0, max: 100, step: 0.01 });
    const years = number('Years in NY', 9);

    const backgroundColor = color('background', '#ffff00');
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const otherStyles = object('Styles', {
      border: '3px solid #ff00ff',
      padding: '10px',
    });
    const nice = boolean('Nice', true);

    // NOTE: the default value must not change - e.g., do not do date('Label', new Date()) or date('Label')
    const defaultBirthday = new Date('Jan 20 2017');
    const birthday = date('Birthday', defaultBirthday);

    const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}.`;
    const style = { backgroundColor, ...otherStyles };
    const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
      <div style={style}>
        <p>{intro}</p>
        <p>My birthday is: {new Date(birthday).toLocaleDateString('en-US', dateOptions)}</p>
        <p>I live in NY for {years} years.</p>
        <p>My wallet contains: ${dollars.toFixed(2)}</p>
        <p>In my backpack, I have:</p>
        <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
        <p>{salutation}</p>
        <hr />
        <p>PS. My shirt pocket contains: </p>
      </div>
    );
  })
  .add('triggers actions via button', () => (
    <div>
      <p>Hit the knob load button and it should trigger an async load after a short delay</p>
      <AsyncItemLoader />
    </div>
  ));

storiesOf('Addon Knobs.withKnobsOptions', module)
  .addDecorator(
    withKnobsOptions({
      debounce: { wait: 100, leading: boolean }, // Same as lodash debounce.
      timestamps: true, // Doesn't emit events while user is typing.
    })
  )
  .add('tweaks static values with debounce delay', () => {
    const name = text('Name', 'Storyteller');
    const age = number('Age', 70, { range: true, min: 0, max: 90, step: 5 });
    const fruits = {
      apple: 'Apple',
      banana: 'Banana',
      cherry: 'Cherry',
    };
    const fruit = select('Fruit', fruits, 'apple');
    const dollars = number('Dollars', 12.5, { min: 0, max: 100, step: 0.01 });

    const backgroundColor = color('background', '#ffff00');
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const otherStyles = object('Styles', {
      border: '3px solid #ff00ff',
      padding: '10px',
    });
    const nice = boolean('Nice', true);

    // NOTE: the default value must not change - e.g., do not do date('Label', new Date()) or date('Label')
    const defaultBirthday = new Date('Jan 20 2017');
    const birthday = date('Birthday', defaultBirthday);

    const intro = `My name is ${name}, I'm ${age} years old, and my favorite fruit is ${fruit}.`;
    const style = { backgroundColor, ...otherStyles };
    const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
      <div style={style}>
        <p>
          If you are encountering performance issues with state updating too often, use
          withKnobsOptions to debounce changes.
        </p>
        <p>{intro}</p>
        <p>My birthday is: {new Date(birthday).toLocaleDateString('en-US', dateOptions)}</p>
        <p>My wallet contains: ${dollars.toFixed(2)}</p>
        <p>In my backpack, I have:</p>
        <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
        <p>{salutation}</p>
        <hr />
        <p>PS. My shirt pocket contains: </p>
      </div>
    );
  })
  .add('triggers actions via button with debounce delay', () => (
    <div>
      <p>Hit the knob load button and it should trigger an async load after a short delay</p>
      <AsyncItemLoader />
    </div>
  ));
