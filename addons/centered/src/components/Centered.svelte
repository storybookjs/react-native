<div class="svelte-centered-wrapper" style="{centeredStyles.style}">
  <div class="svelte-centered-container" style="{centeredStyles.innerStyle}">
    <svelte:component this="{OriginalComponent}" {...originalData} />
  </div>
</div>

<script>
  export default {
    data() {
      return {
        OriginalComponent: null,
        originalData: {},
        centeredStyles: {}
      };
    }
  };
</script>
