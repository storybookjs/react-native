import { document } from 'global';

export default function addHeadWarning(text, className = '') {
  const warning = document.createElement('h1');
  warning.textContent = text;
  warning.className = className;
  warning.style.color = 'red';

  document.body.insertBefore(warning, document.body.firstChild);
}
