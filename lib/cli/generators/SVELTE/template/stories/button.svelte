<button class="button" on:click={onClick}>
    {text}
</button>

<style>
    .button {
      border: 1px solid #eee;
      border-radius: 3px;
      backgroundColor: #FFFFFF;
      cursor: pointer;
      font-size: 15px;
      padding: 3px 10px;
      margin: 10px;
    }
</style>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function onClick(event) {
    dispatch('click', event)
  }
</script>
