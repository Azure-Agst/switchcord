/* eslint-disable no-console */

//modules
const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const request = require('request');
const DiscordRPC = require('discord-rpc');

// fancy consts and shit
const smallicon = path.join(__dirname, 'resources/switch.png');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
var startTimestamp = new Date();

//init empty stash obj for ipc
var stash = new Object();
stash.gamename = stash.gamestate = "";

// don't change the client id if you want this example to work
const ClientId = '439883639539499019';

// change next line if you want development config
let dev = false;

let mainWindow, subWindow;
let tray = null;

// ============================================================================
// init some objects

var menuTemplate = [
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
  }}
];

var trayTemplate = [
  {label: 'Open App', type: 'normal', click: function(){
    mainWindow.show();
  }},
  {label: 'Quit', type: 'normal', click: function(){
    app.isQuitting = true;
    if (subWindow) subWindow.destroy();
    tray.destroy();
    app.quit();
  }}
];


// ============================================================================
// handle dev vars first

if (dev) {
  var exampleurl = 'http://azureagst.pw/switchrpc/devgames.json'
  menuTemplate.push({label: 'Inspect', click: function(){subWindow.toggleDevTools()}});
} else {
  var exampleurl = 'http://azureagst.pw/switchrpc/examplegames.json'
  require('update-electron-app')({repo: 'Azure-Agst/switchrpc'});
}

// ============================================================================
// main window function

function createMainWindow() {

  var mainwindowopt = {
    width: 340,
    height: 380,
    resizable: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#e60012',
    icon: smallicon
  }

  if (dev) {
    mainwindowopt.resizable = true;
  }

  mainWindow = new BrowserWindow(mainwindowopt);

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
// sub window function

function createSubWindow() {

  var subwindowopt = {
    width: 500,
    height: 550,
    resizable: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#e60012',
    icon: smallicon,
    parent: mainWindow
  }

  subWindow = new BrowserWindow(subwindowopt);

  if (dev) {
    subwindowopt.resizable = true;
  } else {
    subWindow.setMenu(null);
  }


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
// app initialization function

app.on('ready', () => {

  require('update-electron-app')({repo: "Azure-Agst/switchrpc/"});

  //check for json
  if (!fs.existsSync('games.json')){
    console.log("games.json does not exist!")
    request.get(exampleurl).pipe(fs.createWriteStream('games.json'));
    while(!fs.existsSync('./games.json')){}
  }

  // INIT TRAY
  tray = new Tray(smallicon);
  const contextMenu = Menu.buildFromTemplate(trayTemplate);
  tray.setToolTip('SwitchRPC');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });

  // MAKE APP MENU
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // MAKE MAIN WINDOW
  createMainWindow();
});

// if the app gets reactivated...
app.on('activate', () => {
  if (mainWindow === null)
    createMainWindow();
});

// ============================================================================
// IPC COMMANDS

ipcMain.on('updatejson', function(event, arg){
  /*
  Here's how this rolls:
  1. init vars
  2. add properties from master identified by array usergames to a new objects
  3. overwrite old json if exists
  4. send response
  */
  //call = "ipcRenderer.send('updatejson', {usergames, master})"

  var newjson = {};
  for (i=0;i<arg.usergames.length;i++){
    newjson[arg.usergames[i]] = arg.master.games[arg.usergames[i]];
  }

  console.log(newjson);

  fs.writeFileSync('./games.json', JSON.stringify(newjson));

  event.sender.send('jsonupdated', true);
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
      smallImageText: 'SwitchRPC',
      instance: false,
    });
  }

  //stashing...
  stash.gamename = arg.gamename;
  stash.gamestate = arg.gamename;
});

// ============================================================================

rpc.login(ClientId).catch(console.error);
