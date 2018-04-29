##!/usr/bin/env bash

echo "[Pack] Starting Packager..."

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

  return;
}

function packageWin {
  CHECKWIN=$(ls ./packages || grep *-win32-x64.zip)
  if [[ $CHECKWIN == "" ]]; then
    echo "[PackageWin] Windows Wrapper not found. Skipping Windows..."
    return;
  else
    echo "[PackageWin] Windows Wrapper found! Extracting..."
    unzip -q ./packages/$CHECKWIN -d ./packages/windows
  fi

  if [[ ! -f "./app.asar" ]]; then
    echo "[PackageWin] App.asar doesnt exist! Please compile and try again."
    exit 1
  fi

  cp ./app.asar ./packages/windows/resources/app.asar

  echo "[PackageWin] Windows app compiled!"
}

function masterPack {
  if [[ ! -d "packages" ]]; then
    echo "[Pack] Folder 'package' doesn't exist! Please make sure your wrappers are located in './packages'. Exiting Script..."
    exit 1;
  fi

  packageWin
}

masterPack
