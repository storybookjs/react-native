---
id: 'manual-testing'
title: 'Manual Testing'
---

Now we arrive at the most interesting (but also hardest) part of UI testing.
We usually do this as a team.

First, we need to make a pretty solid Storybook or a set of Storybooks covering most of the scenarios of our UI components.
For that we can follow the following structure:

-   Write stories for your individual UI components.
-   Write another set of stories for integrating the above UI components (you could consider your pages).

For the individual UI components, you may be using a different repository.
Then, keep a storybook inside it for those components. Then, in the main app, write stories for integrations.

## Testing Plan

Open a new PR (or multiple of them).
Then run your Storybook and start reviewing one story at a time.
Then you can comment on the PR.
