<button class="button" on:click="onClick(event)">
    {text}
</button>

<style>
    .button {
      border: 1px solid #eee;
      border-radius: 3px;
      backgroundColor: #FFFFFF;
      cursor: pointer;
      font-size: 15px;
      padding: 3px 10px;
      margin: 10px;
    }
</style>

<script>
  export default {
    methods: {
      onClick(event) {
        this.fire('click', event)
      }
    }
  }
</script>
