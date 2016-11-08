import { expect } from 'chai';
import { describe, it } from 'mocha';

import loaders from '../loaders';

const returnArg = arg => arg;
const returnNull = () => null;

const expecteds = {
  jpg: returnArg,
  png: returnArg,
  gif: returnArg,
  eot: returnArg,
  svg: returnArg,
  ttf: returnArg,
  woff: returnArg,
  woff2: returnArg,
  css: returnNull,
  scss: returnNull,
  sass: returnNull,
};

describe('loaders', () => {
  const exts = Object.keys(expecteds);

  expect(loaders).to.have.all.keys(exts);

  exts.forEach((ext) => {
    describe(`.${ext}`, () => {
      const expected = expecteds[ext]('test');

      it(`should return "${expected}"`, () => {
        const actual = loaders[ext]('test');

        expect(actual).to.equal(expected);
      });
    });
  });
});
