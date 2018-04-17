import { document } from 'global';

export default function addCssWarning() {
  const warning = document.createElement('h1');
  warning.textContent = 'CSS rules are not configured as needed';
  warning.className = 'css-rules-warning';
  warning.style.color = 'red';

  document.body.insertBefore(warning, document.body.firstChild);
}
