/* eslint-disable no-undef */
export default function copy(str) {
  const tmp = document.createElement('TEXTAREA');
  const focus = document.activeElement;

  tmp.value = str;

  document.body.appendChild(tmp);
  tmp.select();
  document.execCommand('copy');
  document.body.removeChild(tmp);
  focus.focus();
}
