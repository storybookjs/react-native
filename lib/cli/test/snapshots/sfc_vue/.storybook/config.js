import { configure } from '@storybook/vue'

function loadStories() {
  require('../src/stories')
}

configure(loadStories, module)
