import addons from '@storybook/addons';

export const withNotes = ({ notes, component: story }) => {
  const channel = addons.getChannel();

  return {
    created() {
      channel.emit('storybook/notes/add_notes', notes);
    },
    render(h) {

      let component =  story;
      if (typeof story === 'function') {
        component = story();
      }

      if (typeof component === 'string') {
        component = { template: component };
      } else if (typeof component === 'function') {
        component = { render: component };
      }

      return h(component);
    }
  }
};
