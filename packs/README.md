# Git packs

This directory is filled with git packs of our packages when you run the `build-packs` command.

The purpose of this is to enable the `test-cra` app to use the packs as "local" installs without linking, and thus behave like a normal app would, yet still use our latest code. It's awkward for development but good to double check things, especially in CI.
