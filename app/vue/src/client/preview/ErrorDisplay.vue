<template>
  <div class="errordisplay_main">
    <div class="errordisplay_heading">{{ message }}</div>
    <pre class="errordisplay_code">
      <code>
        {{ stack }}
      </code>
    </pre>
  </div>
</template>

<script>
  export default {
    name: 'error-display',
    props: {
      message: {
        type: String,
        required: true
      },
      stack: {
        type: String,
        required: true
      }
    }
  }
</script>

<style>
  .errordisplay_main {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20;
    background-color: rgb(187, 49, 49);
    color: #FFF;
    webkit-font-smoothing: antialiased;
  }

  .errordisplay_heading {
    font-size: 20;
    font-weight: 600;
    letter-spacing: 0.2;
    margin: 10px 0;
    font-family: -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif;
  }
  
  .errordisplay_code {
    font-size: 14;
    width: 100vw;
    overflow: auto;
  }
</style>
