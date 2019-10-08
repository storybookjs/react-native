export default {
  title: 'Demo',
};

export const heading = () => '<h1>Hello World</h1>';

export const button = () => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = 'Hello Button';
  btn.addEventListener('click', e => console.log(e));
  return btn;
};
