const { webFrame, remote, ipcRenderer, shell } = require('electron');
const request = require("request");
const path = require('path');
const fs = require('fs');

const package = require(path.join(__dirname, '../../package.json'));

var options, state, master;
var newgames = new Object();

state = 1; //loading

document.getElementById("menu").innerHTML = '<p class="text-align: center;">loading...</p>'
document.getElementById("version").innerHTML = "v"+package.version;

//run once on settings load
request.get('http://azureagst.pw/switchrpc/master.json', function(err, response, body){
  if (err) console.log("what the fuck");
  if (!response){
    console.log("uh... no response?");
    document.getElementById("menu").innerHTML = "uh please reload";
  }
  if (response.statusCode != 200) console.log("not 200");
  master = JSON.parse(body);
  var tempgame;

  options = "<form id='gamepicker'>"
  for (i=0; i<master.gamelist.length; i++){
      tempgame = master.games[master.gamelist[i]];
      options += '<input type="checkbox" id='+master.gamelist[i]+'>'+tempgame.fullname+"</input><br>";
  }
  options += "</form>"
  document.getElementById("menu").innerHTML = options;

  //enable games already in games.json
  var currentgames = Object.keys(JSON.parse(fs.readFileSync("./games.json")));
  for (i=0;i<currentgames.length;i++){
    document.getElementById(currentgames[i]).checked = true;
  }

  state = 0;
});

document.getElementById("submit-btn").addEventListener("click", function (e) {
  if (state != 0){
    alert("Dude the list hasnt even loaded yet.");
    return;
  }

  document.getElementById('update').innerHTML = "Updating..."

  var usergames = []
  var x = document.getElementById("gamepicker");
  for (i = 0; i < x.length ;i++) {
    if (x.elements[i].checked){
      usergames.push(x.elements[i].id);
    }
  }

  newgames.usergames = usergames; newgames.master = master;
  ipcRenderer.send('updatejson', newgames);
});

document.getElementById("close-btn").addEventListener("click", function (e) {
     var window = remote.getCurrentWindow();
     window.close();
});

function suggest(){
  shell.openExternal('https://github.com/Azure-Agst/switchrpc/issues/new?template=suggestion.md');
};

ipcRenderer.on('jsonupdated', function(event, arg){
  document.getElementById('update').innerHTML = "Updated!"
});
