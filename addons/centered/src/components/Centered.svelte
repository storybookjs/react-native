<div style="{styles.style}">
  <div style="{styles.inner}">
    <svelte:component this="{Story}" {...storyData} />
  </div>
</div>

<script>
  export default {
    data() {
      return {
        storyData: {}, // The story data
        Story: null,
        styles: {}
      };
    }
  };
</script>
