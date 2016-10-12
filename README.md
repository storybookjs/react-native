# getstorybook

Easiest way to add [Storybook](https://github.com/kadirahq/react-storybook) support to your project.

![](docs/getstorybook.png)

First install the storybook generator globally.

```
npm i -g getstorybook
```

Then go to your project and run:

```
getstorybook
```

That's all you've to do.

---

## Yarn support

getstorybook also supports yarn. If you are using yarn, this is how to use it:

```
yarn global add getstorybook
getstorybook --use-yarn
```

`getstorybook` will identify it's installed with yarn and it'll use yarn to install deps.

> This is the way, if you wanna use yarn for all of your storybook projects.

If that's not the case, you can do this:

```
npm i -g getstorybook
getstorybook --use-yarn

```

For more information, refer [React Storybook](https://github.com/kadirahq/react-storybook) documentation.
