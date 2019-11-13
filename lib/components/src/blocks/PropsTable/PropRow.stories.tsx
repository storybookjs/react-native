import React from 'react';
import { PropRow } from './PropRow';
import { Table } from './PropsTable';
import { ResetWrapper } from '../../typography/DocumentFormatting';

export default {
  component: PropRow,
  title: 'Docs|PropRow',
  excludeStories: /.*Def$/,
  decorators: [
    getStory => (
      <ResetWrapper>
        <Table>
          <tbody>{getStory()}</tbody>
        </Table>
      </ResetWrapper>
    ),
  ],
};

export const stringDef = {
  name: 'someString',
  type: { name: 'string' },
  required: true,
  description: 'someString description',
  defaultValue: 'fixme',
};

export const longNameDef = {
  ...stringDef,
  name: 'reallyLongStringThatTakesUpSpace',
};

export const longDescDef = {
  ...stringDef,
  description: 'really long description that takes up a lot of space. sometimes this happens.',
};

export const numberDef = {
  name: 'someNumber',
  type: { name: 'number' },
  required: false,
  description: 'someNumber description',
  defaultValue: 0,
};

export const objectDef = {
  name: 'someObject',
  type: { name: 'objectOf', value: { name: 'number' } },
  required: false,
  description: 'A simple `objectOf` propType.',
  defaultValue: { value: '{ key: 1 }', computed: false },
};

export const arrayDef = {
  name: 'someOArray',
  type: { name: 'arrayOf', value: { name: 'number' } },
  required: false,
  description: 'array of a certain type',
  defaultValue: { value: '[1, 2, 3]', computed: false },
};

export const complexDef = {
  name: 'someComplex',
  type: {
    name: 'objectOf',
    value: {
      name: 'shape',
      value: {
        id: {
          name: 'number',
          description:
            "Just an internal propType for a shape.\n It's also required, and as you can see it supports multi-line comments!",
          required: true,
        },
        func: {
          name: 'func',
          description: 'A simple non-required function',
          required: false,
        },
        arr: {
          name: 'arrayOf',
          value: {
            name: 'shape',
            value: {
              index: {
                name: 'number',
                description: '5-level deep propType definition and still works.',
                required: true,
              },
            },
          },
          description: 'An `arrayOf` shape',
          required: false,
        },
      },
    },
  },
  required: false,
  description: 'A very complex `objectOf` propType.',
  defaultValue: {
    value: '{\n  thing: {\n    id: 2,\n    func: () => {},\n    arr: [],\n  },\n}',
    computed: false,
  },
};

export const funcDef = {
  name: 'concat',
  type: { name: '(a: string, b: string) => string' },
  required: true,
  description: 'concat 2 string values.',
  defaultValue: '(a, b) => { return a + b; }',
  jsDocTags: {
    params: [
      { title: 'param', name: 'a', description: 'The first string' },
      { title: 'param', name: 'b', description: 'The second string' },
    ],
    returns: { title: 'returns', description: 'The concatenation of both strings' },
  },
};

export const markdownDef = {
  name: 'someString',
  type: { name: 'string' },
  description:
    'A `prop` can *support* __markdown__ syntax. This was ship in ~~5.2~~ 5.3. [Find more info in the storybook docs.](https://storybook.js.org/)',
};

export const string = () => <PropRow row={stringDef} />;
export const longName = () => <PropRow row={longNameDef} />;
export const longDesc = () => <PropRow row={longDescDef} />;
export const number = () => <PropRow row={numberDef} />;
export const objectOf = () => <PropRow row={objectDef} />;
export const arrayOf = () => <PropRow row={arrayDef} />;
export const complex = () => <PropRow row={complexDef} />;
export const func = () => <PropRow row={funcDef} />;
export const markdown = () => <PropRow row={markdownDef} />;
