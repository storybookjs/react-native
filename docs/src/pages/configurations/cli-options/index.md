---
id: 'cli-options'
title: 'CLI Options'
---

React Storybook comes with two CLI utilities. They are `start-storybook` and `build-storybook`.

They have some options you can pass to alter the storybook behaviors. We have seen some of them in previous docs.

Here are all those options:

## For start-storybook

```plaintext
Usage: start-storybook [options]

Options:

--help                        output usage information
-V, --version                 output the version number
-p, --port [number]           Port to run Storybook
-h, --host [string]           Host to run Storybook
-s, --static-dir <dir-names>  Directory where to load static files from, comma-separated list
-c, --config-dir [dir-name]   Directory where to load Storybook configurations from
--https                       Serve Storybook over HTTPS. Note: You must provide your own certificate information.
--ssl-ca <ca>                 Provide an SSL certificate authority. (Optional with --https, required if using a self-signed certificate)
--ssl-cert <cert>             Provide an SSL certificate. (Required with --https)
--ssl-key <key>               Provide an SSL key. (Required with --https)
--smoke-test                  Exit after successful start
--ci                          CI mode (skip interactive prompts, don't open browser)
--quiet                       Suppress verbose build output
```

## For build-storybook

```plaintext
Usage: build-storybook [options]

Options:

-h, --help                    output usage information
-V, --version                 output the version number
-s, --static-dir <dir-names>  Directory where to load static files from, comma-separated list
-o, --output-dir [dir-name]   Directory where to store built files
-c, --config-dir [dir-name]   Directory where to load Storybook configurations from
-w, --watch                   Enable watch mode
```
