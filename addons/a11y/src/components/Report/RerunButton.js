import glamorous from 'glamorous';

const RerunButton = glamorous.button({
  position: 'absolute',
  bottom: 0,
  right: 0,
  border: 'none',
  borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
  borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
  background: 'rgba(255, 255, 255, 0.5)',
  padding: '5px 10px',
  borderRadius: '4px 0 0 0',
  color: 'rgba(0, 0, 0, 0.5)',
  textTransform: 'uppercase',
});

export default RerunButton;
