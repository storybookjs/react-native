function getParser(type) {
  if (type === 'javascript' || /\.jsx?/.test(type) || !type) {
    // eslint-disable-next-line global-require
    return require('./parser-js').default;
  }

  if (type === 'typescript' || /\.tsx?/.test(type)) {
    // eslint-disable-next-line global-require
    return require('./parser-ts').default;
  }

  if (type === 'flow') {
    // eslint-disable-next-line global-require
    return require('./parser-flow').default;
  }

  throw new Error(`Parser of type "${type}" is not supported`);
}

export default getParser;
