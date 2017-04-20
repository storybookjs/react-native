import mock from 'mock-fs';
import { getHeadHtml } from './utils';

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
      expect(result).toEqual('');
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
      expect(result).toEqual(HEAD_HTML_CONTENTS);
    });
  });
});
