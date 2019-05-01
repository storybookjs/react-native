<h1>Button view</h1>
<Button {rounded} on:click={handleClick}>{text}: {count}</Button>
<p>A little text to show this is a view.</p>
<p>If we need to test components in a Svelte environment, for instance to test slot behaviour,</p>
<p>then wrapping the component up in a view</p>
<p>made just for the story is the simplest way to achieve this.</p>

<script>
  import Button from '../../components/Button.svelte';

  export let rounded = false;
  export let count = 0;
  export let text = 'You clicked';

  function handleClick(event) {
    count += 1;
  }
</script>
