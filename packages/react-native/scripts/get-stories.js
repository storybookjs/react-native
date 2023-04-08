const { writeRequires } = require('./loader');
const { getArguments } = require('./handle-args');
const args = getArguments();

writeRequires(args);
