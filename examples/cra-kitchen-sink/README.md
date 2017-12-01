
# Testing

## Unit tests 

Run everything following the standard file pattern of CRA:

`yarn run test`

It will generate and compare HTML snapshots using Storyshots.

## Image snapshots using Storyshots

The idea is to check the full rendering of stories on Google Chrome.
Your stories are browsed using Google Chrome and a screenshot is taken for each story.
For each story, the image captured is compared with the previous one taken, just like a regular HTML snapshot.

Currently, we check image snapshots against the static build of the storybook. (ie. _storybook-static_ folder)

*Why ?* Simply because Google Chrome opens the static HTML file (iframe.html), the static built generated to capture screenshots.
It avoids the need to serve the storybook via a HTTP server for instance.

### Run it

`yarn run test-image-snapshots` 

and everything should go smoothly. 
It will ensure at first that a static build of Storybook is generated and up-to-date.

Each time you want to compare image snapshots, you will need to have an up-to-date static version of the storybook.

# FAQ

### Why my generated screenshots are outdated ?

- Do not forget to re-build the static version of the storybook to generate up-to-date screenshots.

### Can I run *test* and *test-image-snapshots* at the same time ?  

- Yes, nothing prevents you from using both goals. It will then generates HTML snapshots AND image snapshots for your stories.


