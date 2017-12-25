import { File } from 'global';

const date = '2017-12-02T11:13:22.492Z';
const file = new File([''], 'filename.txt', {
  type: 'text/plain',
  lastModified: new Date(date),
});

const input = {
  a: 'A',
  b: 1,
  c: true,
  d: /AA/g,
  e: date,
  f: file,
};
input.circular = input;

const output = {
  '$___storybook.objectName': 'Object',
  '$___storybook.isCyclic': true,
  a: 'A',
  b: 1,
  c: true,
  circular: {
    $ref: '$',
  },
  d: {
    '$___storybook.regExpKey': '/AA/g',
  },
  e: '2017-12-02T11:13:22.492Z',
  f: {
    '$___storybook.objectName': 'File',
    lastModified: 1512213202492,
    name: 'filename.txt',
    size: 0,
    type: 'text/plain',
  },
};

export default {
  input,
  output,
};
