export default {
  title: 'Addons|Notes',
};

export const story1 = () =>
  `<p>
      <strong>
        This is a fragment of HTML
      </strong>
    </p>`;
story1.story = {
  name: 'Simple note',
  parameters: {
    notes: 'My notes on some bold text',
  },
};
