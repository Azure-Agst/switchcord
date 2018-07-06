![Banner](./img/banner.png)
=====

[![Build Status](https://travis-ci.com/Azure-Agst/switchrpc.svg?branch=master)](https://travis-ci.com/Azure-Agst/switchrpc) ![license](https://img.shields.io/badge/License-GNU-brightgreen.svg) [![paypal](https://img.shields.io/badge/Donate-paypal.me-blue.svg)](https://paypal.me/AzureAugust) 

An electron app to show your friends on Discord what Nintendo Switch games you're playing!

If you like the app and have an idea, do consider forking and making a pull request! Or, consider [buying me a cup of coffee](https://paypal.me/AzureAugust) to keep the development moving!

### Downloads

Download the most recent releases [here](https://github.com/Azure-Agst/switchrpc/releases)!

### Add a Game

[Click Here to Suggest a Game!](https://github.com/Azure-Agst/switchrpc/issues/new?template=suggestion.md)

### Packaging

If for some godforesaken reason you want to package the app for yourself, you'll need to do a few things:

1. Clone the repo or download the source code.
2. Make sure you have ASAR and electron-packager installed globally.
3. Use `npm install --dev` in the app directory to install.
4. Open up a bash shell (i.e. Terminal/Git Bash) and execute these commands in the root directory:

```
$ chmod +x ./packager.sh
$ /packager.sh --make
```

### Build

To build, clone the repo, cd into ./app and run `npm install --dev`. This will install electron and all dependencies for a development environment. You can start the app by running `npm start` while inside the app directory.

=====

SwitchRPC (c) 2018 @Azure_Agst, Nintendo Switch is a trademark of Nintendo.
