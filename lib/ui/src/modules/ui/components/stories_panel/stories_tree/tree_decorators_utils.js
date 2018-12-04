import React from 'react';

function getParts(name, highlight) {
  const nameParts = [];
  let last = 0;

  highlight.forEach(([start, end]) => {
    if (last < start) {
      nameParts.push({
        strong: false,
        text: name.substring(last, start),
      });
    }

    nameParts.push({
      strong: true,
      text: name.substring(start, end + 1),
    });

    last = end + 1;
  });

  if (last < name.length) {
    nameParts.push({
      strong: false,
      text: name.substring(last, name.length),
    });
  }

  return nameParts;
}

export function highlightNode(node, style) {
  const { name, highlight } = node;

  if (!highlight || !highlight.length) {
    return name;
  }

  const nameParts = getParts(name, highlight);

  return nameParts
    .filter(part => part.text)
    .map((part, index) => {
      const key = `${part.text}-${index}`;

      if (part.strong) {
        return (
          <strong key={key} style={style.highLightText}>
            {part.text}
          </strong>
        );
      }

      return <span key={key}>{part.text}</span>;
    });
}
