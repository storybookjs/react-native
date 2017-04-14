import { stripIndent } from 'common-tags';

export default {
  id: 'security',
  title: 'Security',
  content: stripIndent`
    We have access to your GitHub repos and some other personal information about you. We understand that with great power comes great responsibility. We try to minimize the possibility of security breaches by always following essential security measures and adhering to stringent company-wide policies.

    As a startup, we know that a security breach would pose a critical threat to our credibility and ability to attract and retain customers. So, we'll do whatever we can to prevent it. Here are some of the security measures we follow.

    ## Everything Goes Over SSL

    All our network communication is carried over SSL. This includes communications between:

    * Web browser and the Storybook Hub web server.
    * All of our Internal Services.
    * All of the Database communications.

    So, it's highly unlikely that someone in between you, us, and GitHub will be able to read your code or other information.

    ## We Don't Keep Your Code

    Even though we have access to your code, we don't keep it. We only keep your storybooks. Storybooks are stored on encrypted disks, and you can only access these storybooks by visiting a given storybook URLs. Only the collaborators in your workspace can access these storybooks.

    > In the case of public apps, anyone could access these storybooks.

    ## We Use Isolated Build Environments

    Each and every storybook is built inside an isolated build environment with the help of Docker containers. So, there's no way that others' repositories can access your code unless there's an issue with Docker itself. We always use a stable version of Docker and apply operating system security patches to minimize such issues.

    These build servers cannot be accessed from the Internet and run inside a private network. So, it's impossible for someone to launch an internet-based attack.

    ## Kadira Employees Don't Read Your Code

    Our developers do not have access to your GitHub access keys and they never will be able to read your code. Our system engineers and founders do have access to your access tokens, since they have full access to our servers and databases. But they don't read or use your access tokens manually for any reason.

    Each of our employees is required to sign a contract regarding these matters before they start working for us.

    ## We Don't Use Your Repositories When Testing

    For development and staging purposes, we won't use your access keys and repos—for those purposes, we use our own set of keys and repos. In this way, we make sure we won't damage your repositories or code while testing.

    ## Partner Access

    We use Amazon AWS, Google Cloud, Galaxy, Heroku, and Compose to build our infrastructure. So, if there were a security breach in those services it might be possible to access your code. However, this is a risk shared by all cloud deployments and is very unlikely.

    ## Deleting Your Apps and The Account

    You can delete apps via our user interface. Once you have done that, we'll stop building storybooks for the related repository and access code for that repository. However, we don't delete your existing storybooks.

    If you need to delete existing storybooks or delete your entire account, just contact us via [storybooks@kadira.io](mailto:storybooks@kadira.io).

    ## Enterpise Deployments

    Even though we've implemented these security practices, your company policies may prevent you from using Kadira Storybooks. We understand that. That's why we support Enterprise deployments that work nicely with your GitHub Enterprise instance (or [github.com](http://github.com/)).

    Contact us via [storybooks@kadira.io](mailto:storybooks@kadira.io) to get started.

    ## TALK TO US

    If you need more information or have found a vulnerability, email us at [storybooks@kadira.io](mailto:storybooks@kadira.io). We're happy to talk with you.
  `,
};
