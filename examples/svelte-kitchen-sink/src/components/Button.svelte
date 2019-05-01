<button
  class="button"
  class:rounded={rounded}
  on:click={onClick}>
  <strong>{ rounded ? 'Round' : 'Square' } corners</strong><br>
  { text }
  <slot></slot>
</button>

<style>
  .rounded {
    border-radius: 35px;
  }

  .button {
    border: 3px solid;
    padding: 10px 20px;
    background-color: white;
    outline: none;
  }
</style>

<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';
  export let count = 0;
  export let text = '';
  export let rounded = true;

  const dispatch = createEventDispatcher();

  function onClick(event) {
    rounded = !rounded;

    dispatch('click', event);
  }

  afterUpdate(() => {
    dispatch('afterUpdate');
  });
</script>
