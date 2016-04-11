const { describe, it, beforeEach, afterEach } = global;
import { expect } from 'chai';
import { getHeadHtml } from '../utils';
import mock from 'mock-fs';

const HEAD_HTML_CONTENTS = '<script>console.log("custom script!");</script>';

describe('server.getHeadHtml', () => {
  describe('when .storybook/head.html does not exist', () => {
    beforeEach(() => {
      mock({
        config: {},
      });
    });

    afterEach(() => {
      mock.restore();
    });

    it('return an empty string', () => {
      const result = getHeadHtml('./config');
      expect(result).to.be.equal('');
    });
  });

  describe('when .storybook/head.html exists', () => {
    beforeEach(() => {
      mock({
        config: {
          'head.html': HEAD_HTML_CONTENTS,
        },
      });
    });

    afterEach(() => {
      mock.restore();
    });

    it('return the contents of the file', () => {
      const result = getHeadHtml('./config');
      expect(result).to.be.equal(HEAD_HTML_CONTENTS);
    });
  });
});
