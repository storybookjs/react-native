import glamorous from 'glamorous';

const dynamicStyles = props => {
  const styles = [];

  if (props.bordered) {
    styles.push({
      border: '1px solid #ccc',
    });
  }

  if (props.code) {
    styles.push({
      whiteSpace: 'nowrap',
      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    });
  }

  return styles;
};

const styles = {
  padding: '2px 6px',
};

export const td = glamorous.td(styles, dynamicStyles);
export const th = glamorous.th(styles, dynamicStyles);
