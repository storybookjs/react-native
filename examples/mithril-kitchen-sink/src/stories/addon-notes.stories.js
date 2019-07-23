/** @jsx m */

import m from 'mithril';

export default {
  title: 'Addons|Notes',
};

export const story1 = () => ({
  view: () => (
    <p>
      <strong>
        Etiam vulputate elit eu venenatis eleifend. Duis nec lectus augue. Morbi egestas diam sed
        vulputate mollis. Fusce egestas pretium vehicula. Integer sed neque diam. Donec consectetur
        velit vitae enim varius, ut placerat arcu imperdiet. Praesent sed faucibus arcu. Nullam sit
        amet nibh a enim eleifend rhoncus. Donec pretium elementum leo at fermentum. Nulla
        sollicitudin, mauris quis semper tempus, sem metus tristique diam, efficitur pulvinar mi
        urna id urna.
      </strong>
    </p>
  ),
});

story1.story = {
  name: 'Simple note',
  parameters: { notes: 'My notes on some bold text' },
};

export const story2 = () => ({
  view: () => (
    <p>
      <span>🤔😳😯😮</span>
      <br />
      <span>😄😩😓😱</span>
      <br />
      <span>🤓😑😶😊</span>
    </p>
  ),
});

story2.story = {
  name: 'Note with HTML',
  parameters: {
    notes: `
    <h2>My notes on emojies</h2>

    <em>It's not all that important to be honest, but..</em>

    Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
  `,
  },
};
