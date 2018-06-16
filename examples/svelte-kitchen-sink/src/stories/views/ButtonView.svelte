<Button rounded="{true}">{message}</Button>

<script>
  import Button from '../../components/Button.svelte';

  export default {
    data() {
      return {
        message: 'Default text'
      };
    },
    components: { Button }
  };
</script>
