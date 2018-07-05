##!/usr/bin/env bash

APP="./app"
APPNAME="SwitchRPC"
FLAGS="--arch=x64 --asar --out=packages --overwrite"

# linux, mas, win32

function prelim {
  # Check for ASAR
  ASAR=$(asar -V);
  if [[ ! $ASAR =~ ^v ]]; then
    echo "ASAR is not installed! Use 'npm install -g asar' to install!"
    exit 1
  else
    echo "Using ASAR ${ASAR}"
  fi

  # Check for electron packager
  ASAR=$(electron-packager --version);
  if [[ ! $ASAR =~ ^Electron ]]; then
    echo "Electron-packager is not installed! Use 'npm install -g electron-packager' to install!"
    exit 1
  fi

  return;
}

function packageWin {
  echo "Packing Windows [x64]..."
  echo "(with flags '--platform=win32 $FLAGS')"
  electron-packager $APP $APPNAME --platform=win32 $FLAGS
}

function packageMac {
  echo "Packing Mac [x64]..."
  echo "(with flags '--platform=mas --osx-sign $FLAGS')"
  electron-packager $APP $APPNAME --platform=mas --osx-sign $FLAGS
}

function packageLin {
  echo "Packing Linux [x64]..."
  echo "(with flags '--platform=linux $FLAGS')"
  electron-packager $APP $APPNAME --platform=linux $FLAGS
}

function packageDar {
  echo "Packing Darwin [x64]..."
  echo "(with flags '--platform=darwin $FLAGS')"
  electron-packager $APP $APPNAME --platform=darwin $FLAGS
}

function masterPack {
  packageWin
  packageMac
  packageLin
  packageDar
}


function helptext {
  echo "__________                __                                 "
  echo "\\______   \\_____    ____ |  | _______     ____   ___________ "
  echo " |     ___/\\__  \\ _/ ___\\|  |/ /\\__  \\   / ___\\_/ __ \\_  __ \\"
  echo " |    |     / __ \\\\  \\___|    <  / __ \\_/ /_/  >  ___/|  | \\/"
  echo " |____|    (____  /\\___  >__|_ \\(____  /\\___  / \\___  >__|   "
  echo "                \\/     \\/     \\/     \\//_____/      \\/       "
  echo "(c) 2018 Azure-Agst"
  echo ""
  echo "Streamlines the dev environment for packaging electron apps. Tailored for"
  echo "this project, but may work on others? idk."
  echo ""
  echo "Syntax: './packager.sh'"
}

if [[ ! $1 ]]; then
  prelim
  masterPack
  echo "Done Packing!";
  exit 0
elif [[ $1 == "--win" ]]; then
  packageWin
  echo "Done Packing!";
  exit 0
elif [[ $1 == "--mac" ]]; then
  packageMac
  echo "Done Packing!";
  exit 0
elif [[ $1 == "--linux" ]]; then
  packageLin
  echo "Done Packing!";
  exit 0
elif [[ $1 == "--darwin" ]]; then
  packageDar
  echo "Done Packing!";
  exit 0
fi
