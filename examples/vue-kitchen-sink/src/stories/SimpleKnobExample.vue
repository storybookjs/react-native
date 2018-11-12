<template>
  <div @click="i++">I am {{ name }} and I'm {{ age }} years old. Inner State Counter {{ i }}</div>
</template>

<script>
  export default {
    props: {
      name: String,
      age: Number,
    },
    data() {
      return {
        i: 40,
      };
    },
    created() {
      console.log('created');
    },
    destroyed() {
      console.log('destroyed');
    },
  }
</script>