<button
  class="button {roundedClass}"
  on:click="onClick(event)">
  {text}
  <slot></slot>
</button>

<style>
  .rounded {
    border-radius: 5px;
  }

  .button {
    border: 3px solid;
    padding: 10px 20px;
    background-color: white;
    outline: none;
  }
</style>

<script>
  export default {
    data () {
      return {
        count: 0,
        text: '', // component supports both <slot> and text prop.
        rounded: true
      };
    },

    computed: {
      roundedClass({ rounded }) {
        return rounded ? 'rounded' : ''
      }
    },

    methods: {
      onClick(event) {
        const {rounded} = this.get();

        this.set({rounded: !rounded});

        this.fire('click', event)
      }
    }
  }
</script>
