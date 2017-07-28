<template>
  <div class="nopreview_wrapper">
    <div class="nopreview_main">
      <h1 class="nopreview_heading">No Preview</h1>
      <p>Sorry, but you either have no stories or none are selected somehow.</p>
      <ul>
        <li>Please check the storybook config.</li>
        <li>Try reloading the page.</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'no-preview',
  }
</script>

<style>
  .nopreview_wrapper {
    position: fixed;
    display: flex;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20;
    align-content: center;
    justify-content: center;
    font-family: -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif;
    webkit-font-smoothing: antialiased;
  }
  .nopreview_main {
    margin: auto;
    padding: 30px;
    border-radius: 10px;
    background: rgba(0,0,0,0.03);
  }

  .nopreview_heading {
    font-size: 20;
    font-weight: 600;
    letter-spacing: 0.2;
    margin: 10px 0;
    text-align: center;
  }
  
</style>
