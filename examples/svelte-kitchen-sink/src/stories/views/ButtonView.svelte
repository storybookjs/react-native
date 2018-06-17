<h1>Button view</h1>
<Button {rounded} on:click="onButtonClicked(event)">{message} {count}</Button>
<p>A little text to show this is a view.</p>
<p>If we need to test components in a Svelte
environment, for instance to test slot behaviour,</p>
<p>then wrapping the component up in a view made</p>
<p>just for the story is the simplest way to achieve this.</p>

<script>
  import Button from '../../components/Button.svelte';

  export default {
    data() {
      return {
        count: 0,
        message: 'You clicked:'
      };
    },

    methods: {
      onButtonClicked(event) {
        let {count} = this.get();

        count += 1;

        this.set({count})
      }
    },

    components: {
      Button
    }
  };
</script>
