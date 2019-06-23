export default {
  title: 'Addons|Notes',
};

export const story1 = () =>
  `<p>
      <strong>
        This is a fragment of HTML
      </strong>
    </p>`;
story1.title = 'Simple note';
story1.parameters = {
  notes: 'My notes on some bold text',
};
