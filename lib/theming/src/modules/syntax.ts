import { mkColor } from '../utils';

interface ColorsHash {
  [key: string]: string;
}
interface ColorsObjectsHash {
  [key: string]: {
    color: string;
  };
}

const convertColors = (colors: ColorsHash): ColorsObjectsHash =>
  Object.entries(colors).reduce((acc, [k, v]) => ({ ...acc, [k]: mkColor(v) }), {});

export const create = ({ colors, mono }: { colors: ColorsHash; mono: string }) => {
  const colorsObjs = convertColors(colors);
  return {
    token: {
      fontFamily: mono,
      WebkitFontSmoothing: 'antialiased',

      '&.comment': { ...colorsObjs.green1, fontStyle: 'italic' },
      '&.prolog': { ...colorsObjs.green1, fontStyle: 'italic' },
      '&.doctype': { ...colorsObjs.green1, fontStyle: 'italic' },
      '&.cdata': { ...colorsObjs.green1, fontStyle: 'italic' },

      '&.string': colorsObjs.red1,

      '&.punctuation': colorsObjs.gray1,
      '&.operator': colorsObjs.gray1,

      '&.url': colorsObjs.cyan1,
      '&.symbol': colorsObjs.cyan1,
      '&.number': colorsObjs.cyan1,
      '&.boolean': colorsObjs.cyan1,
      '&.variable': colorsObjs.cyan1,
      '&.constant': colorsObjs.cyan1,
      '&.inserted': colorsObjs.cyan1,

      '&.atrule': colorsObjs.blue1,
      '&.keyword': colorsObjs.blue1,
      '&.attr-value': colorsObjs.blue1,

      '&.function': colorsObjs.gray1,
      '&.deleted': colorsObjs.red2,

      '&.important': {
        fontWeight: 'bold',
      },
      '&.bold': {
        fontWeight: 'bold',
      },

      '&.italic': {
        fontStyle: 'italic',
      },

      '&.class-name': colorsObjs.cyan2,

      '&.tag': colorsObjs.red3,
      '&.selector': colorsObjs.red3,

      '&.attr-name': colorsObjs.red4,
      '&.property': colorsObjs.red4,
      '&.regex': colorsObjs.red4,
      '&.entity': colorsObjs.red4,

      '&.directive.tag .tag': {
        background: '#ffff00',
        ...colorsObjs.gray1,
      },
    },
    'language-json .token.boolean': colorsObjs.blue1,
    'language-json .token.number': colorsObjs.blue1,
    'language-json .token.property': colorsObjs.cyan2,

    namespace: {
      opacity: 0.7,
    },
  };
};
