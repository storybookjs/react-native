const { getArguments } = require('./handle-args');
const args = getArguments();

const { generate } = require('./generate');
generate(args);
