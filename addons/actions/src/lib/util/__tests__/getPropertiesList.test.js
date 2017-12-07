import { File } from 'global';
import getPropertiesList from '../getPropertiesList';

describe('getPropertiesList', () => {
  it('for plain object', () => {
    expect(getPropertiesList({ a: 'A', b: 'B' })).toEqual(['a', 'b']);
  });

  it('for File object', () => {
    const file = new File([''], 'filename.txt', { type: 'text/plain', lastModified: new Date() });

    expect(getPropertiesList(file)).toEqual(['name', 'lastModified', 'size', 'type', 'isClosed']);
  });
});
