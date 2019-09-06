import { styled, CSSObject, Theme } from '@storybook/theming';
import { withReset } from './withReset';

const headerCommon = ({ theme }: { theme: Theme }): CSSObject => ({
  margin: '20px 0 8px',
  padding: 0,
  cursor: 'text',
  position: 'relative',
  color: theme.color.defaultText,
  '&:first-of-type': {
    marginTop: 0,
    paddingTop: 0,
  },
  '&:hover a.anchor': {
    textDecoration: 'none',
  },
  '& tt, & code': {
    fontSize: 'inherit',
  },
});

const withMargin: CSSObject = {
  margin: '16px 0',
};

export const H1 = styled.h1<{}>(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.l1}px`,
  fontWeight: theme.typography.weight.black,
}));

export const H2 = styled.h2<{}>(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.m2}px`,
  paddingBottom: '4px',
  borderBottom: `1px solid ${theme.appBorderColor}`,
}));

export const H3 = styled.h3<{}>(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.m1}px`,
}));

export const H4 = styled.h4<{}>(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.s3}px`,
}));

export const H5 = styled.h5<{}>(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.s2}px`,
}));

export const H6 = styled.h6<{}>(withReset, headerCommon, ({ theme }) => ({
  fontSize: `${theme.typography.size.s2}px`,
  color: theme.color.dark,
}));

export const Pre = styled.pre<{}>(withReset, withMargin, ({ theme }) => ({
  // reset
  fontFamily: theme.typography.fonts.mono,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  lineHeight: '18px',
  padding: '11px 1rem',
  whiteSpace: 'pre-wrap',
  color: 'inherit',
  borderRadius: 3,
  margin: '1rem 0',

  '&:not(.hljs)': {
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    padding: 0,
    margin: 0,
  },
  '& pre, &.hljs': {
    padding: 15,
    margin: 0,
    whiteSpace: 'pre-wrap',
    color: 'inherit',
    fontSize: '13px',
    lineHeight: '19px',
    code: {
      color: 'inherit',
      fontSize: 'inherit',
    },
  },
  '& code': {
    whiteSpace: 'pre',
  },
  '& code, & tt': {
    border: 'none',
  },
}));

export const A = styled.a<{}>(withReset, ({ theme }) => ({
  fontSize: theme.typography.size.s2,
  lineHeight: '24px',

  color: `${theme.color.secondary}`,
  textDecoration: 'none',
  '&.absent': {
    color: '#cc0000',
  },
  '&.anchor': {
    display: 'block',
    paddingLeft: '30px',
    marginLeft: '-30px',
    cursor: 'pointer',
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
  },
}));

export const HR = styled.hr<{}>(({ theme }) => ({
  border: '0 none',
  color: theme.appBorderColor,
  height: '4px',
  padding: '0',
}));

export const DL = styled.dl<{}>(withReset, {
  ...withMargin,
  padding: 0,
  '& dt': {
    fontSize: '14px',
    fontWeight: 'bold',
    fontStyle: 'italic',
    padding: 0,
    margin: '16px 0 4px',
  },
  '& dt:first-of-type': {
    padding: 0,
  },
  '& dt > :first-of-type': {
    marginTop: 0,
  },

  '& dt > :last-child': {
    marginBottom: 0,
  },

  '& dd': {
    margin: '0 0 16px',
    padding: '0 15px',
  },

  '& dd > :first-of-type': {
    marginTop: 0,
  },

  '& dd > :last-child': {
    marginBottom: 0,
  },
});

export const Blockquote = styled.blockquote<{}>(withReset, withMargin, ({ theme }) => ({
  borderLeft: `4px solid ${theme.color.medium}`,
  padding: '0 15px',
  color: theme.color.dark,
  '& > :first-of-type': {
    marginTop: '0',
  },
  '& > :last-child': {
    marginBottom: 0,
  },
}));

export const Table = styled.table<{}>(withReset, withMargin, ({ theme }) => ({
  fontSize: theme.typography.size.s2,
  lineHeight: '24px',
  padding: 0,
  borderCollapse: 'collapse',
  '& tr': {
    borderTop: `1px solid ${theme.appBorderColor}`,
    backgroundColor: 'white',
    margin: '0',
    padding: '0',
  },
  '& tr:nth-of-type(2n)': {
    backgroundColor: `${theme.color.lighter}`,
  },
  '& tr th': {
    fontWeight: 'bold',
    border: `1px solid ${theme.appBorderColor}`,
    textAlign: 'left',
    margin: '0',
    padding: '6px 13px',
  },
  '& tr td': {
    border: `1px solid ${theme.appBorderColor}`,
    textAlign: 'left',
    margin: '0',
    padding: '6px 13px',
  },
  '& tr th :first-of-type, & tr td :first-of-type': {
    marginTop: '0',
  },
  '& tr th :last-child, & tr td :last-child': {
    marginBottom: '0',
  },
}));

export const Img = styled.img<{}>({
  maxWidth: '100%',
});

export const Div = styled.div<{}>(withReset);

export const Span = styled.span<{}>(withReset, ({ theme }) => ({
  '&.frame': {
    display: 'block',
    overflow: 'hidden',
  },
  '&.frame > span': {
    border: `1px solid ${theme.color.medium}`,
    display: 'block',
    float: 'left',
    overflow: 'hidden',
    margin: '13px 0 0',
    padding: '7px',
    width: 'auto',
  },
  '&.frame span img': {
    display: 'block',
    float: 'left',
  },
  '&.frame span span': {
    clear: 'both',
    color: theme.color.darkest,
    display: 'block',
    padding: '5px 0 0',
  },
  '&.align-center': {
    display: 'block',
    overflow: 'hidden',
    clear: 'both',
  },
  '&.align-center > span': {
    display: 'block',
    overflow: 'hidden',
    margin: '13px auto 0',
    textAlign: 'center',
  },
  '&.align-center span img': {
    margin: '0 auto',
    textAlign: 'center',
  },
  '&.align-right': {
    display: 'block',
    overflow: 'hidden',
    clear: 'both',
  },
  '&.align-right > span': {
    display: 'block',
    overflow: 'hidden',
    margin: '13px 0 0',
    textAlign: 'right',
  },
  '&.align-right span img': {
    margin: '0',
    textAlign: 'right',
  },
  '&.float-left': {
    display: 'block',
    marginRight: '13px',
    overflow: 'hidden',
    float: 'left',
  },
  '&.float-left span': {
    margin: '13px 0 0',
  },
  '&.float-right': {
    display: 'block',
    marginLeft: '13px',
    overflow: 'hidden',
    float: 'right',
  },
  '&.float-right > span': {
    display: 'block',
    overflow: 'hidden',
    margin: '13px auto 0',
    textAlign: 'right',
  },
}));

const listCommon: CSSObject = {
  paddingLeft: '30px',
  '& :first-of-type': {
    marginTop: 0,
  },
  '& :last-child': {
    marginBottom: 0,
  },
};

export const LI = styled.li<{}>(withReset, ({ theme }) => ({
  fontSize: theme.typography.size.s2,
  color: theme.color.defaultText,
  lineHeight: '24px',
  '& + li': {
    marginTop: '.25em',
  },
  '& ul, & ol': {
    marginTop: '.25em',
    marginBottom: 0,
  },
}));

export const UL = styled.ul<{}>(withReset, withMargin, listCommon, {});

export const OL = styled.ol<{}>(withReset, withMargin, listCommon);

const codeCommon = ({ theme }: { theme: Theme }): CSSObject => ({
  margin: '0 2px',
  padding: '0 5px',
  whiteSpace: 'nowrap',
  border: `1px solid ${theme.color.mediumlight}`,
  backgroundColor: theme.color.lighter,
  borderRadius: '3px',
  fontSize: theme.typography.size.s2 - 1,
});

export const P = styled.p<{}>(withReset, withMargin, ({ theme }) => ({
  fontSize: theme.typography.size.s2,
  lineHeight: '24px',
  color: theme.color.defaultText,
  '& code': codeCommon({ theme }),
}));

export const Code = styled.code<{}>(
  ({ theme }) => ({
    // from reset
    fontFamily: theme.typography.fonts.mono,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    display: 'inline-block',
    paddingLeft: 2,
    paddingRight: 2,
    verticalAlign: 'baseline',
    color: 'inherit',
  }),
  codeCommon
);

export const TT = styled.title<{}>(codeCommon);

/**
 * This is a "local" reset to style subtrees with Storybook styles
 *
 * We can't style individual elements (e.g. h1, h2, etc.) in here
 * because the CSS specificity is too high, so those styles can too
 * easily override child elements that are not expecting it.
 */

export const ResetWrapper = styled.div<{}>(withReset);
