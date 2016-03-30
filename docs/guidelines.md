# Guidelines for Creating Stories

* Write UI components by passing data via props. In this way, you can isolate UI components easily. (Maybe you can follow a pattern like Mantra.)
* Do not write app-specific code inside your UI components.
* Write your stories close to your UI components. A directory called 'stories' inside your components directory is a good idea.
* In Meteor, you may need to use a directory name with '.stories' or create it inside the 'tests' directory. Otherwise, these story files will be loaded by Meteor.
* In a single story module, create stories for a single component.
* Prefix story names with a dot (.). For example, see:

```js
storiesOf('core.Button', module)
```

* Always use actions to debug event props (event handlers).
