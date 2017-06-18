/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

export default {
  name: 'my-button',

  data () {
    return {
      buttonStyles: {
        border: '1px solid #eee',
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        cursor: 'pointer',
        fontSize: 15,
        padding: '3px 10px',
        margin: 10
      }
    }
  },

  template: `
    <button :style="buttonStyles" @click="onClick">
      <slot></slot>
    </button>
  `,

  methods: {
    onClick () {
    }
  }
}
