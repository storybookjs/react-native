<div class="main">
  <h1>Link Action</h1>
  <button on:click="onClick(event)" class="link">
    Return to the <code class="code">Welcome</code> view story.
  </button>
</div>

<style>

</style>

<script>
  export default {
    methods: {
      onClick(event) {
        this.fire('click', event);
      },
    }
  };
</script>
