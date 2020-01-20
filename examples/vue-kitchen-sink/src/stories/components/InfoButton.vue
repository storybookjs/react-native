<script>
/**
 * InfoButton component description
 */
export default {
  props: {
    /**
     * Whether to disable button
     */
    disabled: {
      type: Boolean,
    },
    /**
     * Button type
     */
    type: {
      type: String,
      default: 'normal',
    },
    label: {
      type: String,
      required: true,
    },
  },
  methods: {
    click(ev) {
      /**
       * Passthrough click event
       * @type {Event}
       */
      this.$emit('click', ev);
    },
  },
};
</script>

<template>
  <button class="btn" :class="type" :disabled="disabled" @click="click">
    <!-- @slot Default to label prop -->
    <img width="60px" src="../../logo.png" />
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style scoped>
.btn {
  padding: 3px 10px;

  border: 3px solid #42b983;
  border-radius: 5px;
  background-color: #fff;
  color: #333;
}

.btn:active {
  opacity: 0.9;
}

.btn.primary {
  background-color: #33f;
  color: #fff;
}

.btn:disabled {
  background-color: #eee;
  color: #777;
}
</style>
