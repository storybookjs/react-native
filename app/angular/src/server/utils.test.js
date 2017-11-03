import mock from 'mock-fs';
import { getPreviewHeadHtml } from './utils';

const HEAD_HTML_CONTENTS = '<script>console.log("custom script!");</script>';

describe('server.getPreviewHeadHtml', () => {
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
      const result = getPreviewHeadHtml('./config');
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
      const result = getPreviewHeadHtml('./config');
      expect(result).toEqual(HEAD_HTML_CONTENTS);
    });
  });
});
