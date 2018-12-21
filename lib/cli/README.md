# Storybook CLI

Storybook CLI (_Command Line Interface_) is the easiest way to add [Storybook](https://github.com/storybooks/storybook) to your project.

In the future it will also add other useful generators and migration tooling.

![Screenshot](docs/getstorybook.png)

Just go to your project and run:

```sh
cd my-app
npx -p @storybook/cli sb init
```

That's all you've to do.

---

## [Yarn](https://github.com/yarnpkg/yarn) support

The CLI supports yarn. If you have installed yarn in your system, it'll detect it and use `yarn` instead of `npm`.

If you don't want to use `yarn` always you can use the `--use-npm` option like this:

```sh
npx -p @storybook/cli sb init --use-npm
```

---

## [Flow](https://flow.org/) support

It also supports flow files. By default, [jscodeshift](https://github.com/facebook/jscodeshift), the tool used to transform the source files, uses babel to read the files. To be able to transform any flow annotated file, you need to use the flow parser.

```sh
npx -p @storybook/cli sb init --parser flow
```

For more information visit: [storybook.js.org](https://storybook.js.org)

---

## Manually specify project type

If the CLI cannot detect your project type, it will ask you. You can also force it to use a particular project type:

```sh
npx -p @storybook/cli sb init --type <type>
```

Where type is one of the project types defined in [project_types.js](https://github.com/storybooks/storybook/blob/master/lib/cli/lib/project_types.js)
