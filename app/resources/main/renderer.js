const { webFrame } = require('electron');
const path = require('path');
const fs = require('fs');

var selopt, steopt;
var ipc = new Object();
const gameselect = document.getElementById('gameselect');
const gamestate = document.getElementById('gamestate');

//set up gameselect
var games = JSON.parse(fs.readFileSync("./games.json"));
var gamearr = Object.keys(games);

selopt += "<option value='home'>Home Menu</option>"
for (i=0;i<gamearr.length;i++){
  var gameobj = games[gamearr[i]];
  selopt += "<option value='"+gamearr[i]+"'>"+gameobj.fullname+"</option>"
}
gameselect.innerHTML = selopt

//set up gamestate
steopt = "<option value='null'>Just Looking Around</option>"
gamestate.innerHTML = steopt //yeah yeah, could be one line but idc

// ============================================================================

function updateGame() {
  /*
  Here's how this rolls:
  1. update gamestate dropdown
  2. change ipc var to default
  3. call ipc
  */

  // home is a hardcoded value
  if (gameselect.value == "home") {
    gamestate.innerHTML = "<option value='null'>Just Looking Around</option>"
    ipc.appiconid = gameselect.value;
    ipc.gamename = "Home Menu";
    ipc.gamestate = "Just Looking Around"
    //TODO: ipc call

  //if game is not in json
  } else if (gamearr.indexOf(gameselect.value) == -1) {
    gamestate.innerHTML = "<option value='null'>Hacking SwitchRPC</option>"
    ipc.appiconid = "home";
    ipc.gamename = "This guy's a hacker";
    ipc.gamestate = "Hacking SwitchRPC :("
    //TODO: ipc call

  //not home, game is in json
  } else {
    var newstates = games[gameselect.value].states; //error here, returning object
    var stateoptions = "";
    for (i=0;i<newstates.length;i++){
      stateoptions += "<option>"+newstates[i]+"</option>";
      console.log(newstates[i]);
    }
    gamestate.innerHTML = stateoptions;
    ipc.appiconid = gameselect.value;
    ipc.gamename = games[gameselect.value].fullname;
    ipc.gamestate = newstates[0]; //default to first state
    console.log("game = "+ipc.gamename);
    //TODO: ipc call
  }
};

// ============================================================================

function updateState() {
  /*
  Here's how this rolls:
  1. Get inner contents of gamestate
  2. Update IPC
  */

  ipc.gamestate = gamestate.options[gamestate.selectedIndex].text;
  console.log("gamestate = "+ipc.gamestate);
  //TODO: ipc call
}
