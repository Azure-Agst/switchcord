##!/usr/bin/env bash

function compile {
  # Check for ASAR
  ASAR=$(asar -V);
  if [[ ! $ASAR =~ ^v ]]; then
    echo "ASAR is not installed! Use 'npm install -g asar' to install!"
    exit 1
  else
    echo "Using ASAR ${ASAR}"
  fi

  cd app
  if [[ ! -d "node_modules" ]]; then
    echo "[Compile] Installing Dependencies..."
    npm install --production --loglevel=error
  else
    echo "[Compile] Hiding Electron..."
    npm uninstall electron --loglevel=error
  fi
  echo "[Compile] Packing ASAR..."
  asar pack ./ ../app.asar
  echo "[Compile] ASAR Located at ./app.asar"

  echo "[Compile] (Re)installing Electron..."
  npm install electron --loglevel=error
  cd ../

  return;
}

function packageWin {
  CHECKWIN=$(find ./wrappers -name '*-win32-x64.zip')
  if [[ $CHECKWIN == "" ]]; then
    echo "[PackageWin] Windows Wrapper not found. Skipping Windows..."
    return;
  else
    echo "[PackageWin] Windows Wrapper found! Extracting..."
    unzip -q $CHECKWIN -d ./packages/windows
  fi

  echo "[PackageWin] Copying asar into wrapper..."
  cp ./app.asar ./packages/windows/resources/app.asar

  echo "[PackageWin] Windows app compiled!"
}

function packageMac {
  CHECKWIN=$(find ./wrappers -name '*-mas-x64.zip')
  if [[ $CHECKWIN == "" ]]; then
    echo "[PackageMac] Mac Wrapper not found. Skipping Windows..."
    return;
  else
    echo "[PackageMac] Mac Wrapper found! Extracting..."
    unzip -qq $CHECKWIN -d ./packages/mac
    echo "[PackageMac] NOTE: Please disregard any symlink error(s) above, apparently"
    echo "             unzip doesn't agree with the mac wrappers. :/"
  fi

  echo "[PackageMac] Copying asar into wrapper..."
  cp ./app.asar ./packages/mac/Electron.app/Contents/Resources/app.asar

  echo "[PackageMac] Mac app compiled!"
}

function packageLin {
  CHECKWIN=$(find ./wrappers -name '*-linux-x64.zip')
  if [[ $CHECKWIN == "" ]]; then
    echo "[PackageLin] Linux Wrapper not found. Skipping Windows..."
    return;
  else
    echo "[PackageLin] Linux Wrapper found! Extracting..."
    unzip -qq $CHECKWIN -d ./packages/linux
  fi

  echo "[PackageLin] Copying asar into wrapper..."
  cp ./app.asar ./packages/linux/resources/app.asar

  echo "[PackageLin] Mac app compiled!"
}

function masterPack {
  if [[ ! -d "wrappers" ]]; then
    mkdir wrappers
    echo "[Pack] Folder 'wrappers' doesn't exist! We've made it for you. Please place your"
    echo ".zip's in './wrappers' and run again. Exiting Script..."
    exit 1;
  fi

  if [[ ! -f "./app.asar" ]]; then
    echo "[MasterPack] App.asar doesnt exist! Please compile and try again."
    exit 1
  fi

  echo "[MasterPack] Cleaning up from last build."
  if [[ ! -d "packages" ]]; then
    mkdir packages
  else
    rm -rf packages/*
  fi

  echo "[MasterPack] ===== Packing Windows! Handing off to PackageWin... ====="
  packageWin
  echo "[MasterPack] ===== Packing Mac! Handing off to PackageMac... ====="
  packageMac
  echo "[MasterPack] ===== Packing Linux! Handing off to PackageLin... ====="
  packageLin
  echo "[MasterPack] ===== All Versions Packed! ====="
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
  echo "Syntax: './packager.sh [command]'"
  echo "-m, --make    - Compiles and Packages the app. The real deal!"
  echo "-c, --compile - Only compiles the app to './app.asar'."
  echo "-p, --pack    - Packages the app. Depends on what .zips you have in './wrappers'."
  echo "-h, --help    - Spews out this help text."
}

if [[ ! $1 ]]; then
  helptext
elif [[ $1 == "--compile" ]] || [[ $1 == "-c" ]]; then
  echo "[Packager] Argument $1 passed, calling Compile"
  compile
elif [[ $1 == "--pack" ]] || [[ $1 == "-p" ]]; then
  echo "[Packager] Argument $1 passed, calling MasterPack"
  masterPack
elif [[ $1 == "--make" ]] || [[ $1 == "-m" ]]; then
  echo "[Packager] Argument $1 passed, calling Compile"
  compile
  echo "[Packager] Argument $1 passed, calling MasterPack"
  masterPack
elif [[ $1 == "--help " ]] || [[ $1 == "-h" ]]; then
  helptext
fi
exit 0
