![Banner](./img/banner.png)

### [Downloads](#downloads) | [Add a Game](#add-a-game) | [Build](#build) | [Packaging](#packaging) | [Acknowledgements](#acknowledgements)

-----

[![Build Status](https://travis-ci.com/Azure-Agst/switchrpc.svg?branch=master)](https://travis-ci.com/Azure-Agst/switchrpc) ![license](https://img.shields.io/badge/License-GNU-brightgreen.svg) [![paypal](https://img.shields.io/badge/Donate-paypal.me-blue.svg)](https://paypal.me/AzureAugust) 

An electron app to show your friends on Discord what Nintendo Switch games you're playing!

If you like the app and have an idea, do consider forking and making a pull request! Or, consider [buying me a cup of coffee](https://paypal.me/AzureAugust) to keep the development moving!

### Downloads

Download the most recent releases [here](https://github.com/Azure-Agst/switchrpc/releases)!

### Add a Game

[Click Here to Suggest a Game!](https://github.com/Azure-Agst/switchrpc/issues/new?template=suggestion.md)

### Build

To build, clone the repo, and run `cd app && npm install`. This will install electron and all dependencies for a development environment. You can start the app by running `npm start` while inside the app directory.

### Packaging

To package, set up your development environment as stated in the [build section](#build) above.

We use yarn to package, so make sure it's installed, by running `yarn --version`. If it's not installed, install it [here](https://yarnpkg.com/lang/en/docs/install/#windows-stable) and try `yarn --version` after you install.

Lastly, run `cd app && yarn build` to build for your OS. Once it's complete, your build should be located in the "dist" folder.

*[Note: Packager.sh is still supported, yet using electron-builder with yarn is recommended.]*

### Acknowledgements

I'd like to thank the following people for helping make this project possible:

- **Motezazer** for being such a great friend and helping me with any questions I may have regarding this project.
- **Triggered_Tux** and **soymjolk** for also being good friends and supporting me while I work on this project.
- All the testers and everyone who reached out to help with bugs. I appreciate your help! :)
- The maintainers of the Electron, Electron-Builder, and Discord.js projects. Your work is amazing!

-----

SwitchRPC (c) 2018 @Azure_Agst, Nintendo Switch is a trademark of Nintendo.
