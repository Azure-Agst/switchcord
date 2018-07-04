const { webFrame } = require('electron');
const path = require('path');
const fs = require('fs');

//console.log(__dirname);

window.game = "home";
window.gamename = "Home Menu";
window.gamestate = "null";
var array, posi_states = null;
const gamestate = document.getElementById('gamestate');


var games = JSON.parse(fs.readFileSync("./games.json"));
console.log(games);


function updateGame() {
  console.log(document.getElementById('gameselect').value);

  /*
  switch (document.getElementById('gameselect').value){
    case "spla2n":
      window.game = "splatoon";
      window.gamename = "Splatoon 2";
      gamearray = arrays.splatoon;
      updateDrop();
      break;
    case "mk8d":
      window.game = "mk8d";
      window.gamename = "Mario Kart 8 DX";
      gamearray = arrays.mk8d;
      updateDrop();
      break;
    case "botw":
      window.game = "botw";
      window.gamename = "Zelda: BotW";
      gamearray = arrays.botw;
      updateDrop();
      break;
    case "stardew":
      window.game = "stardew";
      window.gamename = "Stardew Valley";
      gamearray = arrays.stardew;
      updateDrop();
      break;
    case "home":
    default:
      window.game = "home";
      window.gamename = "Home Menu";
      gamearray = arrays.home;
      updateDrop();
  }
  */
};

function updateDrop() {
  gamestate.innerHTML = "";
  //console.log("cleared.")
  for (i=0;i<gamearray.length;i++) {
    var opt = document.createElement('option');
    opt.value = gamearray[i].code;
    opt.appendChild(document.createTextNode(gamearray[i].state));
    //console.log(opt);
    gamestate.appendChild(opt);
  };
  updateState();
}

function updateState() {
  window.gamestate = gamestate[gamestate.selectedIndex].innerHTML;
}
