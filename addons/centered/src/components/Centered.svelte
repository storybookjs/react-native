<div style="{styles.style}">
  <div style="{styles.innerStyle}">
    <svelte:component this="{Story}" {...storyData} />
  </div>
</div>

<script>
  export default {
    data() {
      return {
        storyData: {},
        Story: null,
        styles: {}
      };
    }
  };
</script>
