/* eslint-disable no-console */

const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');

// don't change the client id if you want this example to work
const ClientId = '439883639539499019';

let mainWindow;

let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 340,
    height: 380,
    resizable: false,
    titleBarStyle: 'hidden',
    icon: './switch.png'
  });

  //mainWindow.setMenu(null);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  mainWindow.on('close', function (event) {
    if(!app.isQuiting){
        event.preventDefault();
        mainWindow.hide();
    }

    return false;
  });
}

app.on('ready', () => {
  tray = new Tray('./switch.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open App', type: 'normal', click: function(){
      mainWindow.show();
    }},
    {label: 'Quit', type: 'normal', click: function(){
      app.isQuitting = true;
      tray.destroy();
      app.quit();
    }}
  ])
  tray.setToolTip('SwitchRPC');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });
  createWindow();
});

app.on('activate', () => {
  if (mainWindow === null)
    createWindow();
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
