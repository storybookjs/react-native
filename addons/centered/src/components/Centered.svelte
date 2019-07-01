<div class="svelte-centered-wrapper" style="{style}">
  <div class="svelte-centered-container" style="{innerStyle}">
    <slot></slot>
  </div>
</div>

<script>
  export let style = '';
  export let innerStyle = '';
</script>
