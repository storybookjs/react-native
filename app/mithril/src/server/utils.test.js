import { getPreviewHeadHtml, getManagerHeadHtml } from './utils';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../__mocks__/fs'));
jest.mock('path', () => ({
  resolve: (a, p) => p,
}));

const setup = ({ files }) => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

const HEAD_HTML_CONTENTS = 'UNITTEST_HEAD_HTML_CONTENTS';

describe('getPreviewHeadHtml', () => {
  it('returns an empty string without head.html present', () => {
    setup({
      files: {},
    });

    const result = getPreviewHeadHtml('first');
    expect(result).toEqual('');
  });

  it('return contents of head.html when present', () => {
    setup({
      files: {
        'head.html': HEAD_HTML_CONTENTS,
      },
    });

    const result = getPreviewHeadHtml('second');
    expect(result).toEqual(HEAD_HTML_CONTENTS);
  });

  it('returns contents of preview-head.html when present', () => {
    setup({
      files: {
        'preview-head.html': HEAD_HTML_CONTENTS,
      },
    });

    const result = getPreviewHeadHtml('second');
    expect(result).toEqual(HEAD_HTML_CONTENTS);
  });
});

describe('getManagerHeadHtml', () => {
  it('returns an empty string without manager-head.html present', () => {
    setup({
      files: {},
    });

    const result = getManagerHeadHtml('first');
    expect(result).toEqual('');
  });

  it('returns contents of manager-head.html when present', () => {
    setup({
      files: {
        'manager-head.html': HEAD_HTML_CONTENTS,
      },
    });

    const result = getManagerHeadHtml('second');
    expect(result).toEqual(HEAD_HTML_CONTENTS);
  });
});
