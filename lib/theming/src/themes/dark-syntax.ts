export const create = ({ colors, mono }: { colors: { [key: string]: { color: string } }; mono: { monoTextFace: string } }) => ({
  token: {
    fontFamily: mono.monoTextFace,
    WebkitFontSmoothing: 'antialiased',

    '&.comment': { ...colors.green1, fontStyle: 'italic' },
    '&.prolog': { ...colors.green1, fontStyle: 'italic' },
    '&.doctype': { ...colors.green1, fontStyle: 'italic' },
    '&.cdata': { ...colors.green1, fontStyle: 'italic' },

    '&.string': colors.red1,

    '&.punctuation': colors.gray1,
    '&.operator': colors.gray1,

    '&.url': colors.cyan1,
    '&.symbol': colors.cyan1,
    '&.number': colors.cyan1,
    '&.boolean': colors.cyan1,
    '&.variable': colors.cyan1,
    '&.constant': colors.cyan1,
    '&.inserted': colors.cyan1,

    '&.atrule': colors.blue1,
    '&.keyword': colors.blue1,
    '&.attr-value': colors.blue1,

    '&.function': colors.gray1,
    '&.deleted': colors.red2,

    '&.important': {
      fontWeight: 'bold',
    },
    '&.bold': {
      fontWeight: 'bold',
    },

    '&.italic': {
      fontStyle: 'italic',
    },

    '&.class-name': colors.cyan2,

    '&.tag': colors.red3,
    '&.selector': colors.red3,

    '&.attr-name': colors.red4,
    '&.property': colors.red4,
    '&.regex': colors.red4,
    '&.entity': colors.red4,

    '&.directive.tag .tag': {
      background: '#ffff00',
      ...colors.gray1,
    },
  },
  'language-json .token.boolean': colors.blue1,
  'language-json .token.number': colors.blue1,
  'language-json .token.property': colors.cyan2,

  namespace: {
    opacity: 0.7,
  },
});
