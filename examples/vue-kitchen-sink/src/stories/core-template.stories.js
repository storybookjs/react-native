export default {
  title: 'Core|Template',
};

export const stringOnly = () =>
  '<my-button :rounded="false">A Button with square edges</my-button>';

stringOnly.story = {
  name: 'string only',
};
