import retrocycle from '../retrocycle';
import example from '../__mocks__/example';

describe('Retrocycle', () => {
  it('can restore cyclic object', () => {
    const FileMock = function File() {
      this.close = function close() {};
      this.isClosed = example.input.f.isClosed;
      this.lastModified = example.input.f.lastModified;
      this.name = example.input.f.name;
      this.size = 0;
      this.type = 'text/plain';
    };

    const file = new FileMock();

    const result = {
      a: example.input.a,
      b: example.input.b,
      c: example.input.c,
      d: example.input.d,
      e: example.input.e,
      f: file,
    };

    result.circular = result;

    const revived = retrocycle(JSON.stringify(example.output));

    expect(revived.a).toEqual(example.input.a);
    expect(revived.b).toEqual(example.input.b);
    expect(revived.c).toEqual(example.input.c);
    expect(revived.d).toEqual(example.input.d);
    expect(revived.e).toEqual(example.input.e);
    expect(revived.f.constructor.name).toEqual('File');
    expect(revived.f.isClosed).toEqual(example.input.f.isClosed);
    expect(revived.f.lastModified).toEqual(example.input.f.lastModified);
    expect(revived.f.name).toEqual(example.input.f.name);
    expect(revived.f.size).toEqual(example.input.f.size);
    expect(revived.f.type).toEqual(example.input.f.type);
  });
});
