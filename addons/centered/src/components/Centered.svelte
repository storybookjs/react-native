<div class="style">
  <div class="inner-style">
    <svelte:component this="{Story}" {...data} />
  </div>
</div>

<style>
  .style {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    overflow: auto;
  }

  .inner-style {
    margin: auto;
    max-height: 100%; /* Hack for centering correctly in IE11 */
  }
</style>

<script>
  export default {
    data() {
      return {
        Story: null,
        style: {}
      }
    }
  };
</script>
