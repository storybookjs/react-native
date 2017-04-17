import { stripIndent } from 'common-tags';

export default {
  id: 'private-npm-packages',
  title: 'Private NPM Packages',
  content: stripIndent`
    If you are using private NPM repos or private Github urls we won't be able to access those repos by default. But there are some ways you could grant permission to us.
    
    ## NPM Token
    
    You can provide a NPM token while we are building storybooks. With that, we could could use your private NPM packages inside Storybook Hub. For that, simply create the following environmet variable.
    
    ~~~sh
    SB_NPM_TOKEN
    ~~~

    ## Custom .npmrc

    You can set a [custom \`.npmrc\` file](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) when we are building storybook. With that, you can provide NPM tokens to access your private packages. For that, simply expose the following environmental variable with your custom .npmrc content:

    ~~~sh
    SB_NPMRC
    ~~~

    We will append the above content to your existing .npmrc file if there's a one.

    ## SSH Private Keys

    You may use private Github repos as NPM packages. Then you can set a private key which is authorized to access those repos. For that, simply expose the following environmental variable:

    ~~~sh
    SB_SSHKEY
    ~~~
  `,
};
