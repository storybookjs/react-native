export default {
  title: 'Addons/Notes',
};

export const Story1 = () =>
  `<p>
      <strong>
        This is a fragment of HTML
      </strong>
    </p>`;
Story1.story = {
  name: 'Simple note',
  parameters: {
    notes: 'My notes on some bold text',
  },
};
