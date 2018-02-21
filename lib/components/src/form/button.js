import glamorous from 'glamorous';
import { baseFonts } from '../theme';

export default glamorous
  .button({
    ...baseFonts,
    border: 'none',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.2)',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: '4px 10px 7px',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'box-shadow 0.15s ease-out',
    ':hover': {
      transition: 'background-color 0.15s ease-out',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.3)',
    },
    ':focus': {
      transition: 'background-color 0.15s ease-out',
      outline: 'none',
      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.3)',
    },
    ':active': {
      transition: 'none',
      backgroundColor: 'rgb(247, 247, 247)',
    },
  })
  .withProps({ type: 'button' });
