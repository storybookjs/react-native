# example addon: decorator

This addon exposes a function users can use to wrap their storyFn with. This is called a decorator in storybook's terminology.

A decorator can perform analysis on the storyFn, detect how long it takes to render, detect side-effects, and have access to the storyContext.

It's also possible to wrap the results with some additional html/jsx or provide additional data to the storyFn.

Uses include:
- do side-effects detection
- wrap story with additional html
- add data to storyFn
