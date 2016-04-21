const { describe, it } = global;
import { expect } from 'chai';
import formatActionData from '../formatActionData';

describe('formatActionData', function () {
  it('should not show consecutive arrays having same data', function () {
    const actions = [{
      data: {
        name: 'hello',
        args: 'world',
      },
      id: 1,
    }, {
      data: {
        name: 'hello',
        args: 'world',
      },
      id: 2,
    }];
    const expected = [{
      data: {
        name: 'hello',
        args: 'world',
      },
      count: 2,
      id: 1,
    }];
    expect(formatActionData(actions).length).to.equal(1);
    expect(formatActionData(actions)).to.deep.equal(expected);
  });

  it('should not show consecutive arrays having same data', function () {
    const actions = [{
      data: {
        name: 'hello',
        args: 'world1',
      },
      id: 1,
    }, {
      data: {
        name: 'hello',
        args: 'world2',
      },
      id: 2,
    }];
    const expected = [{
      data: {
        name: 'hello',
        args: 'world1',
      },
      count: 1,
      id: 1,
    }, {
      data: {
        name: 'hello',
        args: 'world2',
      },
      count: 1,
      id: 2,
    }];
    expect(formatActionData(actions).length).to.equal(2);
    expect(formatActionData(actions)).to.deep.equal(expected);
  });
});
