/* eslint-disable no-console */

const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const request = require('request');
const DiscordRPC = require('discord-rpc');

const smallicon = path.join(__dirname, 'resources/switch.png');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
var startTimestamp = new Date();

//init empty stash obj for ipc
var stash = new Object();
stash.gamename = stash.gamestate = "";

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
    resizable: true,
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
    height: 550,
    resizable: true,
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

  //check for json
  if (!fs.existsSync(path.join(__dirname, 'games.json'))){
    console.log("games.json does not exist!")
    request.get('http://azureagst.pw/switchrpc/examplegames.json').pipe(fs.createWriteStream('games.json'));
    while(!fs.existsSync('./games.json')){}
  }

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
      mainWindow.toggleDevTools()
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

// ============================================================================
// IPC COMMANDS

ipcMain.on('updatejson', function(event, arg){
  //TODO: Finish this? :thonk:

  //console.log(arg.master.games['botw'].fullname);

  //arg.usergames.length = number of selected games
  //arg.usergames = shortcode
  //arg.master.games = game object
  //arg.master.games.[game].fullname = game name

  var newjson = {};
  var statearray = [];
  var states;

  for (i=0;i<arg.usergames.length;i++){
    statearray = [];
    states = arg.master.games[arg.usergames[i]];

    for (j=0;j<states.length;j++){
      statearray.push(states[i])
    }

    newjson[arg.usergames[i]] = statearray;
  }

  console.log(newjson)

  //event.sender.send('asynchronous-reply', 'pong')
});


ipcMain.on('updaterpc', function(event, arg){
  /*
  Here's how this rolls:
  1. Check previous game if exists
  2. Update RPC
  3. Stash current values
  */

  console.log(arg)

  if (arg.gamename != stash.gamename){ //detected game change...
    startTimestamp = new Date(); //reset timestamp
  }

  if (arg.gamestate == "Don't Display State"){
    rpc.setActivity({
      details: 'Playing '+arg.gamename,
      startTimestamp,
      largeImageKey: arg.appiconid,
      largeImageText: arg.gamename,
      smallImageKey: 'switchlogo',
      smallImageText: 'SwitchRPC',
      instance: false,
    });
  } else {
    rpc.setActivity({
      details: `Playing `+arg.gamename,
      state: arg.gamestate,
      startTimestamp,
      largeImageKey: arg.appiconid,
      largeImageText: arg.gamename,
      smallImageKey: 'switchlogo',
      smallImageText: 'Nintendo Switch',
      instance: false,
    });
  }

  //stashing...
  stash.gamename = arg.gamename;
  stash.gamestate = arg.gamename;
});

// ============================================================================

// async function setActivity() {
//   if (!rpc || !mainWindow)
//     return;
//
//   if (gameid == "home") {
//     rpc.setActivity({
//       details: `At Home Menu`,
//       startTimestamp,
//       largeImageKey: `${gameid}`,
//       largeImageText: `${gamename}`,
//       smallImageKey: 'switchlogo',
//       smallImageText: 'Nintendo Switch',
//       instance: false,
//     });
//   } else if (gamestate == "Don't Display State" ||
//              gamestate == "Solo Play" ||
//              gamestate == "null" ||
//              gamestate == null) {
//     rpc.setActivity({
//       details: `Playing ${gamename}`,
//       startTimestamp,
//       largeImageKey: `${gameid}`,
//       largeImageText: `${gamename}`,
//       smallImageKey: 'switchlogo',
//       smallImageText: 'Nintendo Switch',
//       instance: false,
//     });
//   } else {
//     rpc.setActivity({
//       details: `Playing ${gamename}`,
//       state: gamestate,
//       startTimestamp,
//       largeImageKey: `${gameid}`,
//       largeImageText: `${gamename}`,
//       smallImageKey: 'switchlogo',
//       smallImageText: 'Nintendo Switch',
//       instance: false,
//     });
//   }
// }
//
// rpc.on('ready', () => {
//   setActivity();
//
//   // activity can only be set every 15 seconds
//   setInterval(() => {
//     setActivity();
//   }, 15e3);
// });

rpc.login(ClientId).catch(console.error);
