import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Storyshots', module)
  .add('text', () => <div>This is a test</div>)
  .add('table', () => (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>type</th>
          <th>default</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>MyName</td>
          <td>MyType</td>
          <td>MyDefault</td>
          <td>MyDesc</td>
        </tr>
      </tbody>
    </table>
  ));
