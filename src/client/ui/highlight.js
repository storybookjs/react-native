/**
 * Parses the JSON string and adds styling and class based on whether
 * a part is string, number, undefined, null or key. Also removes quotes
 * from keys.
 *
 * @param data A stringified JSON
 * @returns {string} String with styling
 */
export default function highlight(data) {
  const json = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const regex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g; // eslint-disable-line
  return json.replace(regex, (match) => {
    let className = 'number';
    let style;
    let result = match;
    if (/^"/.test(result)) {
      if (/:$/.test(result)) {
        className = 'key';
        style = 'color:#800080';
        result = match.replace(/"/g, '');
      } else {
        className = 'string';
        style = 'color:#a31515';
      }
    } else if (/true|false/.test(result)) {
      className = 'boolean';
      style = 'color:#066066';
    } else if (/null|undefined/.test(result)) {
      className = 'null';
      style = 'color:#a31515';
    }
    return `<span class="${className}" style="${style}">${result}</span>`;
  });
}
