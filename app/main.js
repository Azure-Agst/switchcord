/* eslint-disable no-console */

const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');

const smallicon = path.join(__dirname, 'resources/switch.png');

// don't change the client id if you want this example to work
const ClientId = '439883639539499019';

let mainWindow, subWindow;

let tray = null;

// ============================================================================
// main window !!!!!

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 380,
    resizable: false,
    titleBarStyle: 'hidden',
    icon: smallicon
  });

  //mainWindow.setMenu(null);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'resources/main/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('close', function (event) {
    if(!app.isQuitting){
        event.preventDefault();
        mainWindow.hide();
    }

    return false;
  });
}

// ============================================================================
// game chooser window!

function createSubWindow() {
  subWindow = new BrowserWindow({
    width: 680,
    height: 400,
    resizable: false,
    titleBarStyle: 'hidden',
    icon: smallicon
  });

  subWindow.setMenu(null);

  subWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'resources/sub/index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  subWindow.on('close', function (event) {
    event.preventDefault();
    mainWindow.reload();
    subWindow.hide();
  });
}

// ============================================================================

app.on('ready', () => {
  // INIT TRAY
  tray = new Tray(smallicon);
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open App', type: 'normal', click: function(){
      mainWindow.show();
    }},
    {label: 'Quit', type: 'normal', click: function(){
      app.isQuitting = true;
      if (subWindow) subWindow.destroy();
      tray.destroy();
      app.quit();
    }}
  ])
  tray.setToolTip('SwitchRPC');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });

  // MAKE APP MENU
  const appMenu = Menu.buildFromTemplate([
    {label: 'Settings', type: 'normal', click: function(){
      if (!subWindow){
        createSubWindow();
      } else {
        subWindow.show();
      }
    }},
    {label: 'Quit', type: 'normal', click: function(){
      app.isQuitting = true;
      if (subWindow) subWindow.destroy();
      tray.destroy();
      app.quit();
    }},
    {label: 'Inspect', click: function(){
      subWindow.toggleDevTools()
    }}
  ]);
  Menu.setApplicationMenu(appMenu);

  // MAKE MAIN WINDOW
  createMainWindow();
});

app.on('activate', () => {
  if (mainWindow === null)
    createMainWindow();
});

// only needed for discord allowing spectate, join, ask to join
DiscordRPC.register(ClientId);

const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();

async function setActivity() {
  if (!rpc || !mainWindow)
    return;

  var gameid = await mainWindow.webContents.executeJavaScript('window.game');
  var gamename = await mainWindow.webContents.executeJavaScript('window.gamename');
  var gamestate = await mainWindow.webContents.executeJavaScript('window.gamestate');

  if (gameid == "home") {
    rpc.setActivity({
      details: `At Home Menu`,
      startTimestamp,
      largeImageKey: `${gameid}`,
      largeImageText: `${gamename}`,
      smallImageKey: 'switchlogo',
      smallImageText: 'Nintendo Switch',
      instance: false,
    });
  } else if (gamestate == "Don't Display State" ||
             gamestate == "Solo Play" ||
             gamestate == "null" ||
             gamestate == null) {
    rpc.setActivity({
      details: `Playing ${gamename}`,
      startTimestamp,
      largeImageKey: `${gameid}`,
      largeImageText: `${gamename}`,
      smallImageKey: 'switchlogo',
      smallImageText: 'Nintendo Switch',
      instance: false,
    });
  } else {
    rpc.setActivity({
      details: `Playing ${gamename}`,
      state: gamestate,
      startTimestamp,
      largeImageKey: `${gameid}`,
      largeImageText: `${gamename}`,
      smallImageKey: 'switchlogo',
      smallImageText: 'Nintendo Switch',
      instance: false,
    });
  }
}

rpc.on('ready', () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login(ClientId).catch(console.error);
