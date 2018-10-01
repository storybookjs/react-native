<template>
  <div>
    <img src="assets/images/logo.png">
    <h1>{{ msg }}</h1>
    <hello/>
  </div>

  <script>
    riot.mount('hello', {msg: 'riot.js - Simple and elegant component-based UI library'})
  </script>

  <style scoped>
    h1 {
      padding: 0 .25em;
    }
  </style>

</template>
