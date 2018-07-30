---
id: 'css-style-testing'
title: 'CSS/Style Testing'
---

We can also use Storybook as the base for CSS/Style testing with stories as the base. For information on how to correctly apply all of your styles as well as styles from CSS frameworks like Boostrap, Semantic UI or similar check the [configurations section](https://storybook.js.org/configurations/default-config/#css-support). Back to CSS/Style testing: let's have a look at the following Storybook.

![Storybook Screenshot](../static/storybook-screenshot.png)

In that, you can see the Storybook's manager UI. It has UI elements that are not related to your app. However, there's a way to access just a single story.

For an example, let's assume the above storybook runs on port 9009 and we can access it via [http://localhost:9009](http://localhost:9009/).
Then Let's pick a single story: the "with text" story of the Button. So, in this case:

-   selectedKind = Button
-   selectedStory = with text

Then, we can see the above story using the following URL:

<http://localhost:9009/iframe.html?selectedKind=Button&selectedStory=with+text&dataId=0>

![Storybook Iframe Screenshot](../static/storybook-iframe-screenshot.png)

Just like that, you can access all of the stories in your Storybook and use them as a base for visual regression testing.

## Supported CSS/Style Testing Frameworks

There are several frameworks that have out of the box Storybook integrations:
- [StoryShots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) with its [seamless integration](https://github.com/storybooks/storybook/tree/master/addons/storyshots#configure-storyshots-for-image-snapshots) with [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot)
- [Loki](https://loki.js.org/)
- [Percy](https://docs.percy.io/docs/storybook-for-react)
- [Screener](https://screener.io/v2/docs) 
- [Chromatic](https://www.chromaticqa.com)

Additionally frameworks which are based on URL as the input source such as [BackstopJS](https://github.com/garris/BackstopJS) or [Gemini](https://github.com/gemini-testing/gemini) can be used.
