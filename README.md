| <h1>NOTE: THIS PROJECT IS NO LONGER BRING MAINTAINED AND ABSOLUTELY MANGLED!</h1> |
|-----|
|Enough people have messaged me on Reddit/Discord asking for support on this project that I decided to revamp it entirely. Unfortunately, it's hard for me to recreate my own freaking dev environment I used to make this app, with requests being reprecated and all, so I decided to remake it using my current language of choice: Python (w/ PyQT5). I've been working on it between work and school and personal matters, but will take time. Coming soon™. Thanks for your patience.<br><br>I've also disabled issues on this project because I'm using a sqlite database as a main driver for the new app, so more I dont have to deal with countless issues being opened asking to be added to a central JSON file hosted on a domain that doesn't exist anymore. (That was stupid, why did I use that model in the first place?)<br><br>**In the meantime, way I recommend using HeadpatServices's [SwitchPresence-Rewritten](https://github.com/HeadpatServices/SwitchPresence-Rewritten) if you have atmosphere CFW, or Nintenzone's [SwitchRPC](https://github.com/NintenZone/SwitchRPC) project if you're not into that kind of stuff. Both are still maintained (i think) and do a better job than this javascript mess anyways.**<br><br>-Azure|


# Switchcord
(Previously known as SwitchRPC)

-----

### [Downloads](#downloads) | [Build](#build) | [Packaging](#packaging) | [Acknowledgements](#acknowledgements)

-----

[![Build Status](https://travis-ci.com/Azure-Agst/switchcord.svg?branch=master)](https://travis-ci.com/Azure-Agst/switchcord) ![license](https://img.shields.io/badge/License-GNU-brightgreen.svg)

An electron app to show your friends on Discord what Nintendo Switch games you're playing!

If you like the app and have an idea, do consider forking and making a pull request!

### Downloads

Download the most recent releases [here](https://github.com/Azure-Agst/switchrpc/releases)!

### Build

**Warning: I couldn't even get this to work! Try at your own peril!**

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

Switchcord (Formerly known as SwitchRPC) (c) 2018 @Azure_Agst, Nintendo Switch is a trademark of Nintendo.
