const mkColor = color => ({ color });

const l = {
  green1: mkColor('#008000'),
  red1: mkColor('#A31515'),
  red2: mkColor('#9a050f'),
  red3: mkColor('#800000'),
  red4: mkColor('#ff0000'),
  gray1: mkColor('#393A34'),
  cyan1: mkColor('#36acaa'),
  cyan2: mkColor('#2B91AF'),
  blue1: mkColor('#0000ff'),
  blue2: mkColor('#00009f'),
};

export const light = {
  token: {
    fontFamily:
      '"Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Andale Mono", "Lucida Console", Consolas, Monaco, monospace',
    WebkitFontSmoothing: 'antialiased',

    '&.comment': { ...l.green1, fontStyle: 'italic' },
    '&.prolog': { ...l.green1, fontStyle: 'italic' },
    '&.doctype': { ...l.green1, fontStyle: 'italic' },
    '&.cdata': { ...l.green1, fontStyle: 'italic' },

    '&.string': l.red1,

    '&.punctuation': l.gray1,
    '&.operator': l.gray1,

    '&.url': l.cyan1,
    '&.symbol': l.cyan1,
    '&.number': l.cyan1,
    '&.boolean': l.cyan1,
    '&.variable': l.cyan1,
    '&.constant': l.cyan1,
    '&.inserted': l.cyan1,

    '&.atrule': l.blue1,
    '&.keyword': l.blue1,
    '&.attr-value': l.blue1,

    '&.function': l.gray1,
    '&.deleted': l.red2,

    '&.important': {
      fontWeight: 'bold',
    },
    '&.bold': {
      fontWeight: 'bold',
    },

    '&.italic': {
      fontStyle: 'italic',
    },

    '&.class-name': l.cyan2,

    '&.tag': l.red3,
    '&.selector': l.red3,

    '&.attr-name': l.red4,
    '&.property': l.red4,
    '&.regex': l.red4,
    '&.entity': l.red4,

    '&.directive.tag .tag': {
      background: '#ffff00',
      ...l.gray1,
    },
  },
  'language-json .token.boolean': l.blue1,
  'language-json .token.number': l.blue1,
  'language-json .token.property': l.cyan2,

  namespace: {
    opacity: 0.7,
  },
};

const d = {
  gray1: mkColor('#7C7C7C'),
  gray2: mkColor('#c5c8c6'),
  gray3: mkColor('#EDEDED'),
  blue: mkColor('#96CBFE'),
  yellow1: mkColor('#FFFFB6'),
  yellow2: mkColor('#F9EE98'),
  yellow3: mkColor('#DAD085'),
  yellow4: mkColor('#E9C062'),
  orange: mkColor('#fd971f'),
  green1: mkColor('#99CC99'),
  green2: mkColor('#87C38A'),
  green3: mkColor('#A8FF60'),
  pink1: mkColor('#f92672'),
  pink2: mkColor('#FF73FD'),
  pink3: mkColor('#C6C5FE'),
};

export const dark = {
  token: {
    fontFamily:
      '"Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Andale Mono", "Lucida Console", Consolas, Monaco, monospace',
    WebkitFontSmoothing: 'antialiased',

    '&.comment': d.gray1,
    '&.prolog': d.gray1,
    '&.doctype': d.gray1,
    '&.cdata': d.gray1,
    '&.punctuation': d.gray2,

    '.namespace': {
      opacity: 0.7,
    },

    '&.property': d.blue,
    '&.keyword': d.blue,
    '&.tag': d.blue,

    // '&.keyword + [class=""]': d.pink1,

    '&.class-name': {
      ...d.yellow1,
      textDecoration: 'underline',
    },

    '&.boolean': d.green1,
    '&.constant': d.green1,

    '&.symbol': d.pink1,
    '&.deleted': d.pink1,

    '&.number': d.pink2,

    '&.selector': d.green3,
    '&.attr-name': d.green3,
    '&.string': d.green3,
    '&.char': d.green3,
    '&.builtin': d.green3,
    '&.inserted': d.green3,

    '&.variable': d.pink3,

    '&.operator': d.gray3,

    '&.entity': {
      ...d.yellow1,
      cursor: 'help',
    },

    '&.url': d.blue,

    '&.atrule': d.yellow2,
    '&.attr-value': d.yellow2,

    '&.function': d.yellow3,

    '&.regex': d.yellow4,

    '&.important': {
      ...d.orange,
      fontWeight: 'bold',
    },
    '&.bold': {
      fontWeight: 'bold',
    },
    '&.italic': {
      fontStyle: 'italic',
    },
  },
  'language-css .string': d.green2,
  'style .string': d.green2,
};
