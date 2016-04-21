import renderUI from './ui/admin';

export default function handleShortCuts(e, data) {
  if (e.keyCode === 80 && (e.metaKey || e.ctrlKey || (e.keyCode === 19))) {
    // e.preventDefault();
    console.log(e);
    renderUI(data);
  }
}
