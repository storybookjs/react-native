import glamorous from 'glamorous';

export default glamorous
  .button({
    border: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px',
    color: 'rgba(0, 0, 0, 0.5)',
    outline: 'none',
  })
  .withProps({ type: 'button' });
