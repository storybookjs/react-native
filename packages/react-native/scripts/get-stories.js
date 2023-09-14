const { getArguments } = require('./handle-args');
const args = getArguments();

if (args.v6Store) {
  const { writeRequires } = require('./loader');
  writeRequires(args);
} else {
  const { generate } = require('./generate');
  generate(args);
}
