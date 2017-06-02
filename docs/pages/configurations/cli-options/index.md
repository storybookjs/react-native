---
id: 'cli-options'
title: 'CLI Options'
---

React Storybook comes with two CLI utilities. They are `start-storybook` and `build-storybook`.

They have some options you can pass to alter the storybook behaviors. We have seen some of them in previous docs.

Here are all those options:

## For start-storybook

    Usage: start-storybook [options]

    Options:

      -h, --help                    output usage information
      -V, --version                 output the version number
      -p, --port [number]           Port to run Storybook (Required)
      -h, --host [string]           Host to run Storybook
      -s, --static-dir <dir-names>  Directory where to load static files from, comma-separated list
      -c, --config-dir [dir-name]   Directory where to load Storybook configurations from

## For build-storybook

    Usage: build-storybook [options]

    Options:

      -h, --help                    output usage information
      -V, --version                 output the version number
      -s, --static-dir <dir-names>  Directory where to load static files from, comma-separated list
      -o, --output-dir [dir-name]   Directory where to store built files
      -c, --config-dir [dir-name]   Directory where to load Storybook configurations from
