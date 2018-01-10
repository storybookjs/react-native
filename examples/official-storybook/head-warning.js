import { document } from 'global';

export default function addHeadWarning(bundle) {
  const warning = document.createElement('h1');
  warning.textContent = `${bundle} head not loaded`;
  warning.className = `${bundle.toLowerCase()}-head-not-loaded`;
  warning.style.color = 'red';

  document.body.insertBefore(warning, document.body.firstChild);
}
