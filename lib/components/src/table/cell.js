import styled from '@emotion/styled';

const dynamicStyles = ({ bordered, code }) => ({
  ...(bordered ? { border: '1px solid #ccc' } : {}),
  ...(code
    ? {
        whiteSpace: 'nowrap',
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      }
    : {}),
});

const styles = {
  padding: '2px 6px',
};

export const Td = styled.td(styles, dynamicStyles);
export const Th = styled.th(styles, dynamicStyles);

Td.displayName = 'Td';
Th.displayName = 'Th';
