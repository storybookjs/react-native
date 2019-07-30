import { document } from 'global';
import { Meta, Story } from '@storybook/addon-docs/blocks';

<Meta title='Function' />

<Story name='function' height='100px'>{() => {
    const btn = document.createElement('button');
    btn.innerHTML = 'Hello Button';
    btn.addEventListener('click', action('Click'));
    return btn;
  }}</Story>
