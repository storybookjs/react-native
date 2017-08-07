import { baseFonts } from '../../theme';

const toggleWidth = '24px';

export default {
  tree: {
    base: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      fontFamily: baseFonts.fontFamily,
      fontSize: '15px',
      minWidth: '200px',
      marginLeft: '-19px',
    },
    node: {
      base: {
        position: 'relative',
      },
      link: {
        cursor: 'pointer',
        position: 'relative',
        padding: '0px 5px',
        display: 'block',
      },
      activeLink: {
        fontWeight: 'bold',
        backgroundColor: '#EEE',
      },
      toggle: {
        base: {
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'top',
          marginLeft: '-5px',
          height: '24px',
          width: toggleWidth,
        },
        wrapper: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-12px 0 0 -4px',
        },
        height: 10,
        width: 10,
        arrow: {
          fill: '#9DA5AB',
        },
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top',
          maxWidth: `calc(100% - ${toggleWidth})`,
        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px',
        },
        title: {
          lineHeight: '24px',
          verticalAlign: 'middle',
        },
      },
      subtree: {
        paddingLeft: '19px',
        listStyle: 'none',
      },
    },
  },
};
