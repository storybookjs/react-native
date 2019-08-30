# Storybook Addon Edit Page

Storybook Edit Page Addon can add 'edit this page' links in [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

![React Storybook Screenshot](https://storybook.js.org/img/addon-backgrounds.gif)

## Installation

```sh
npm i -D @storybook/addon-edit-page
```

## Configuration

Then create a file called `addons.js` in your storybook config.

Add following content to it (the configuration settings are optional):

```js
import { editPage } from '@storybook/addon-edit-page';

const gitPageResolver = ({ fileName } ) => {
  return fileName;
}
editPage({
  fileNameResolve: gitPageResolver,
  editPageLabel: 'edit this page...',
  render: ({ filePath, shortName, ...rest }) => (
    <div>
      {filePath && (
        <div>
          <h3>{shortName}</h3>
          <a target="_blank" href={filePath}>
            here
          </a>
        </div>
      )}
    </div>
  ),
});

```

## Usage

You can add the source file name to the stories metadata in CSF:

```js
export default {
  title: 'Stories|With edit',
  component: Link,
  parameters: {
    edit: {
      fileName: 'https://github.com/storybookjs/design-system/blob/master/src/components/Link.js'
    },  
  }
};
```

Or to mdx files: 
```md
<Meta
  title="Test mdx|Add edit on Doc tab?"
  parameters={{
    edit:{ 
      fileName: 'https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/docspage.md' 
    }  
 }}/>

```
## Options

**fileNameResolve**: function to resolve the file name, by default returns the supplied fileName<br/>
**editPageLabel**: label for the Edit this page link - by default `Edit this page`<br/>
**render**: function to custom render the `Edit this page` panel <br/>
```js
parameters : {
  filePath: string, //full file path
  shortName: string, //short name of the story file (component name)
  parameters: any,  //parameters of the current story
}
```
