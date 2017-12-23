# Release Process

A Storybook release process based on [Semver](http://semver.org/). In short:

1.  Merge bugfix PRs directly into master automatically release (~daily)

2.  Merge feature and breaking PRs into a release branch (e.g. `release/3.2`) and release features in groups along with a marketing push after a preview period (~monthly)

3.  Consensus on critical infrastructure/bugs that are needed before we can do a minor release, so that we pay down our tech debt as we go.

## Motivation

During the Storybook 3.x transition we've undergone a series of growing pains as
we've opened up the development process. We've had questions about:

1.  how to adhere to semver?
2.  how to do marketing releases (while adhering to semver)?
3.  how to introduce significant new features (e.g. vue support, story hierarchy)?
4.  how to converge on key design decisions (e.g. new addons API)?
5.  how to schedule releases?
6.  how to maintain quality/stability through the process?
7.  how to pay down tech debt as we go?

This process attempts to address all these concerns in one shot.

## Semver

[Semver](http://semver.org/) dictates three types of release:

1.  MAJOR version when you make incompatible API changes,
2.  MINOR version when you add functionality in a backwards-compatible manner, and
3.  PATCH version when you make backwards-compatible bug fixes.

We'll do our best to adhere to Semver, but won't be religious about it. In
particular, we may occasionally release small bits of new functionality in PATCH
releases. We'll try our best to restrict breaking changes to MAJOR releases.

## PATCH releases

Every bugfix should go out as soon as we've verified the fix, and based on the
current rate of contribution, we should be issuing PATCH releases multiple times per week.
Soon we'll automate the process so that a release will go out every time a PR is
merged into `master`, and we've already laid most of the groundwork for this.

## MINOR releases

Every new feature, particularly significant ones (e.g. Vue support, deep
hierarchy for stories) deserves more attention:

1.  They should be well-tested by the community before we release.
2.  They often have architectural implications for the entire Storybook ecosystem, so should be discussed thoroughly before release. Doing `alpha` releases allow us to test in the community without necessarily achieving agreement. For example, currently `Vue` support is in `alpha`, although it contains potentially controversial changes to addons.
3.  They often deserve proper marketing treatment (blog posts, release announcement, podcast, etc.)

Therefore we merge these into a release branch of the form `release/MAJOR.MINOR`
and we create preview releases and get them tested by the community before
merging those branches into `master`.

> NOTE: it is possible to edit the `base` branch in a PR, so we can expect users to issue PRs to `master`, but as maintainers as we see feature releases we should set them to merge into the appropriate release branch.

In general we should release 2-3 headline features per minor release for
marketing purposes. Each headline feature should get its own blog post on the
Storybook medium publication, and the release itself should also get a blog
post.

## MAJOR releases

We should avoid major releases, and should try to do these at most 1-2x per
year. Ideally each breaking change would have been agreed upon by the
maintainers and validated in backwards-compatible feature releases. At some
point once a change has been thoroughly vetted, we deprecate the old way and
give some time for people to upgrade to the new way. Finally MAJOR releases
should have killer features that reward users for upgrading, and should not be
used to scratch our own architectural itches -- unless those itches are really
killing development in some meaningful way.

## Blocking bugs

Most PATCH releases come from community members, who generously fix problems as
they come up. However, there are also bugs that never get picked up and just sit
there gathering upvotes and "me too" comments. We need a way to make sure that
these bugs get addressed.

For every non-PATCH release, we nominate a small number of bugs that must be
addressed before a release can go out by adding them to the milestone. For example, here's a list of blocking bugs [for the 3.2 milestone](https://github.com/storybooks/storybook/milestone/3).

Adding bugs to the milestone helps people looking for good ways to contribute,
or to understand what is blocking the release so they can actually do something
about it. Discussion about which bugs are critical happens in the `#maintenance`
channel [in our Slack](https://now-examples-slackin-rrirkqohko.now.sh/) [![Storybook Slack](https://now-examples-slackin-rrirkqohko.now.sh/badge.svg)].(https://now-examples-slackin-rrirkqohko.now.sh/)


If you're experiencing a bug, the best way to make sure that it gets attention
is to upvote it by adding a "thumbs-up" reaction in Github. This way important
bugs quickly bubble to the top [with a
search](https://github.com/storybooks/storybook/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20sort%3Areactions-%2B1-desc%20label%3Abug).

And of course, the best way to make sure a bug gets addressed quickly is to fix
it yourself and issue a PR. If the fix is good, we'll try to release it quickly
in a patch release.

## Decision-making

-   For PATCH changes, all discussion can occur in issue/PR comments (and random slack chat as needed).
-   For MINOR feature changes, there are multiple stages of discussion:
    -   The feature may be discussed in an issue before it is implemented (ex: <https://github.com/storybooks/storybook/issues/151>)
    -   Once it's implemented, the discussion may be occur on the PR (ex: <https://github.com/storybooks/storybook/pull/1329>)
    -   If people disagree on an implementation and it can't be resolved in discussion, they may issue alternative PR's with different ideas
    -   Ultimately the maintainers will reach a consensus before merging the changes. There is no set process for this, but we're all adults.
    -   Since MINOR features are released in alpha before they are fully released, new issues may be created by end users, etc.
-   For MAJOR infrastructural changes, the discussion may take place over time, in gists like this one, issues, slack discussions, etc.
    -   Once the breaking changes have been reduced to an actual implementation, it looks pretty much like a feature release (only with higher stakes and probably a longer stabilization process).

## FAQ's

#### How does my PR get merged?

-   For PATCH PR's, any maintainer can review, test, approve, and merge it.
-   For MINOR/MAJOR PR's, once a maintainer reviews, tests, and approves it, s/he should clear it with the other maintainers before merging it into the release branch.
