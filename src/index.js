import renderer from 'react-test-renderer'
import path from 'path'
import readPkgUp from 'read-pkg-up'
import runWithRequireContext from './require_context'
const { describe, it, expect } = global

let storybook
let configPath

const babel = require('babel-core')

const pkg = readPkgUp.sync().pkg
const isStorybook =
  (pkg.devDependencies && pkg.devDependencies['@kadira/storybook']) ||
  (pkg.dependencies && pkg.dependencies['@kadira/storybook'])
const isRNStorybook =
  (pkg.devDependencies && pkg.devDependencies['@kadira/react-native-storybook']) ||
  (pkg.dependencies && pkg.dependencies['@kadira/react-native-storybook'])

export default function testStorySnapshots (options = {}) {
  if (isStorybook) {
    storybook = require.requireActual('@kadira/storybook')
    const loadBabelConfig = require('@kadira/storybook/dist/server/babel_config').default
    const configDirPath = path.resolve(options.configPath || '.storybook')
    configPath = path.join(configDirPath, 'config.js')

    const content = babel.transformFileSync(configPath, babelConfig).code
    const contextOpts = {
      filename: configPath,
      dirname: configDirPath
    }
    const babelConfig = loadBabelConfig(configDirPath)

    runWithRequireContext(content, contextOpts)
  } else if (isRNStorybook) {
    storybook = require.requireActual('@kadira/react-native-storybook')
    configPath = path.resolve(options.configPath || 'storybook')
    require.requireActual(configPath)
  } else {
    throw new Error('\'storyshots\' is intended only to be used with react storybook or react native storybook')
  }

  if (typeof describe !== 'function') {
    throw new Error('\'testStorySnapshots\' is intended only to be used inside jest')
  }

  const suit = options.suit || 'Storyshots'
  const stories = storybook.getStorybook()

  for (const group of stories) {
    describe(suit, () => {
      describe(group.kind, () => {
        for (const story of group.stories) {
          it(story.name, () => {
            const renderedStory = story.render()
            const tree = renderer.create(renderedStory).toJSON()
            expect(tree).toMatchSnapshot()
          })
        }
      })
    })
  }
}
