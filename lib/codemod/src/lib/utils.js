import camelCase from 'lodash/camelCase';

const RESERVED = /^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|await|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/;

export const isReserved = name => RESERVED.exec(name);

export const sanitizeName = name => {
  let key = camelCase(name);
  if (isReserved(key)) {
    key = `${key}Story`;
  }
  // prepend _ if name starts with a digit
  if (/^\d/.test(key)) {
    key = `_${key}`;
  }
  return key;
};
