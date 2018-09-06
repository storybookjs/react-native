<template>
  <div class="app">
    <hello></hello>
  </div>

  <script>
    riot.mount('hello', {});
  </script>

  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      margin: 0;
    }

    .app {
      color: #444;
      margin-top: 100px;
      max-width: 600px;
      font-family: Helvetica, sans-serif;
      text-align: center;
      display: flex;
      align-items: center;
    }
  </style>

</template>
