const { webFrame } = require('electron');
const arrays = require('./states.json')

window.game = "home";
window.gamename = "Home Menu";
window.gamestate = "null";
var array, posi_states = null;

function updateGame() {
  console.log(document.getElementById('gameselect').value);
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
      window.gamename = "BotW";
      updateDrop();
      break;
    case "stardew":
      window.game = "stardew";
      window.gamename = "Stardew";
      updateDrop();
      break;
    case "home":
    default:
      window.game = "home";
      window.gamename = "Home Menu";
      gamearray = arrays.home;
      updateDrop();
  }
};

function updateDrop() {
  document.getElementById("gamestate").innerHTML = "";
  //console.log("cleared.")
  for (i=0;i<gamearray.length;i++) {
    var opt = document.createElement('option');
    opt.value = gamearray[i].code;
    opt.appendChild(document.createTextNode(gamearray[i].state));
    //console.log(opt);
    document.getElementById("gamestate").appendChild(opt);
  };
}

function updateState() {
  gamestate = document.getElementById('gamestate');
  window.gamestate = gamestate[gamestate.selectedIndex].innerHTML;
}
