export default {
  title: 'Core/Template',
};

export const StringOnly = () =>
  '<my-button :rounded="false">A Button with square edges</my-button>';

StringOnly.story = {
  name: 'string only',
};
