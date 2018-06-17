<div class="main">
  <h1>Link Action</h1>
  <button on:click="onClick(event)" class="link">
    See the sample stories for the <code class="code">Button</code> component.
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
