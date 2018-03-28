import m from 'mithril';

const BaseButton = {
  view: ({ attrs }) =>
    m(
      'button',
      { disabled: attrs.disabled, onclick: attrs.onclick, style: attrs.style },
      attrs.label
    ),
};

export default BaseButton;
