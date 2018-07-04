import { Input } from '@storybook/components';

export default ({ theme, size }) => ({
  ...Input.sizes({ size, theme }),
  '&.rdt': {
    position: 'relative',
  },
  '& > input': {
    width: '100%',
    height: 32,
    ...Input.styles({ theme }),
    ...Input.alignment({ theme }),
  },
  '& .rdtPicker': {
    display: 'none',
    position: 'absolute',
    width: 200,
    padding: 4,
    marginTop: 1,
    zIndex: 99999,
    background: theme.barFill,
  },
  '&.rdtOpen .rdtPicker': {
    display: 'block',
  },
  '&.rdt .rdtPicker': {
    boxShadow: 'none',
    position: 'static',
  },

  '& .rdtPicker .rdtTimeToggle': {
    textAlign: 'center',
    fontSize: 11,
  },

  '& .rdtPicker table': {
    width: '100%',
    margin: 0,
  },
  '& .rdtPicker td, & .rdtPicker th': {
    textAlign: 'center',
    height: 32,
    boxSizing: 'border-box',
  },
  '& .rdtPicker td': {
    cursor: 'pointer',
  },
  '& .rdtPicker td.rdtDay:hover, & .rdtPicker td.rdtHour:hover, & .rdtPicker td.rdtMinute:hover, & .rdtPicker td.rdtSecond:hover, & .rdtPicker .rdtTimeToggle:hover': {
    color: theme.highlightColor,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  '& .rdtPicker td.rdtOld, & .rdtPicker td.rdtNew': {
    color: '#999999',
  },
  '& .rdtPicker td.rdtToday': {
    position: 'relative',
  },
  '& .rdtPicker td.rdtToday:before': {
    content: '""',
    display: 'inline-block',
    borderLeft: '7px solid transparent',
    borderBottom: `7px solid ${theme.highlightColor}`,
    borderTopColor: 'rgba(0, 0, 0, 0.2)',
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  '& .rdtPicker td.rdtActive, & .rdtPicker td.rdtActive:hover': {
    backgroundColor: theme.highlightColor,
    color: '#fff',
    textShadow:
      '0 -1px 0 rgba(0,0,0,0.25), 0 1px 0 rgba(0,0,0,0.25), -1px 0 0 rgba(0,0,0,0.25), 1px 0 0 rgba(0,0,0,0.25)',
  },
  '& .rdtPicker td.rdtActive.rdtToday:before': {
    borderBottomColor: '#fff',
  },
  '& .rdtPicker td.rdtDisabled, & .rdtPicker td.rdtDisabled:hover': {
    background: 'none',
    color: '#999999',
    cursor: 'not-allowed',
  },

  '& .rdtPicker td span.rdtOld': {
    color: '#999999',
  },
  '& .rdtPicker td span.rdtDisabled, & .rdtPicker td span.rdtDisabled:hover': {
    background: 'none',
    color: '#999999',
    cursor: 'not-allowed',
  },
  '& .rdtPicker th': {
    borderBottom: `1px solid ${theme.highlightColor}`,
  },
  '& .rdtPicker .dow': {
    width: '14.2857%',
    fontSize: 11,
    borderBottom: 'none',
  },
  '& .rdtPicker th.rdtSwitch': {
    width: 100,
    fontSize: 11,
  },
  '& .rdtPicker th.rdtNext, & .rdtPicker th.rdtPrev': {
    fontSize: 11,
    verticalAlign: 'middle',
  },

  '& .rdtPrev span, & .rdtNext span': {
    display: 'block',
    userSelect: 'none',
  },

  '& .rdtPicker th.rdtDisabled, & .rdtPicker th.rdtDisabled:hover': {
    background: 'none',
    color: '#999999',
    cursor: 'not-allowed',
  },
  '& .rdtPicker thead tr:first-child th': {
    cursor: 'pointer',
  },
  '& .rdtPicker thead tr:first-child th:hover': {
    color: theme.highlightColor,
  },

  '& .rdtPicker tfoot': {
    borderTop: '1px solid #f9f9f9',
  },

  '& .rdtPicker button': {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  '& .rdtPicker button:hover': {
    color: theme.highlightColor,
  },

  '& .rdtPicker thead button': {
    width: '100%',
    height: '100%',
  },

  '& td.rdtMonth, & td.rdtYear': {
    height: 50,
    width: '25%',
    cursor: 'pointer',
  },
  '& td.rdtMonth:hover, & td.rdtYear:hover': {
    color: theme.highlightColor,
  },

  '& td.rdtDay': {
    fontSize: 11,
  },

  '& .rdtCounters': {
    display: 'inline-block',
  },

  '& .rdtCounters > div': {
    float: 'left',
  },

  '& .rdtCounter': {
    height: 100,
    width: 40,
  },

  '& .rdtCounterSeparator': {
    lineHeight: '100px',
  },

  '& .rdtCounter .rdtBtn': {
    height: '40%',
    lineHeight: '40px',
    cursor: 'pointer',
    display: 'block',
    fontSize: 11,

    userSelect: 'none',
  },
  '& .rdtCounter .rdtBtn:hover': {
    color: theme.highlightColor,
  },
  '& .rdtCounter .rdtCount': {
    height: '20%',
    fontSize: 11,
  },

  '& .rdtMilli': {
    verticalSlign: 'middle',
    paddingLeft: 8,
    width: 48,
  },

  '& .rdtMilli input': {
    width: '100%',
    fontSize: 11,
    marginTop: 37,
  },
});
