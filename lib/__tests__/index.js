import {describe, it} from 'mocha';
import {expect} from 'chai';
import {sum} from '../';

describe('sum', () => {
  it('should add two numbers correctly', async () => {
    const result = await sum(10, 20);
    expect(result).to.be.equal(30);
  });
});
