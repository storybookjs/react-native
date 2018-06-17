<section id="app">
  <img alt="The Svelte logo" src="./logo.png">
  <h1>{heading}</h1>
  <h2>Essential Links</h2>
  <ul>
    <li><a href="svelte.technology/guide" target="_blank">Core Docs</a></li>
    <li><a href="https://gitter.im/sveltejs/svelte" target="_blank">Gitter Chat</a></li>
    <li><a href="https://twitter.com/sveltejs" target="_blank">Twitter</a></li>
  </ul>
  <h2>Ecosystem</h2>
  <ul>
    <li><a href="https://sapper.svelte.technology/" target="_blank">Sapper</a></li>
    <li><a href="https://www.npmjs.com/package/svelte-loader" target="_blank">svelte-loader</a></li>
  </ul>
</section>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>

<script>
  export default {
    data () {
      return {
        heading: 'Welcome to Your Svelte App'
      }
    }
  }
</script>
