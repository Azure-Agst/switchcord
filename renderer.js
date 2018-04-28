const { webFrame } = require('electron');

window.game = "home";
window.gamename = "Home Menu";

function getgame() {
  console.log(document.getElementById('gameselect').value);
  switch (document.getElementById('gameselect').value){
    case "spla2n":
      window.game = "splatoon";
      window.gamename = "Splatoon 2";
      break;

    case "mk8d":
      window.game = "mk8d";
      window.gamename = "Mario Kart 8 Deluxe";
      break;

    case "botw":
      window.game = "botw";
      window.gamename = "BotW";
      break;

    case "stardew":
      window.game = "stardew";
      window.gamename = "Stardew";
      break;

    case "home":
    default:
      window.game = "home";
      window.gamename = "Home Menu";
  }
};

// setInterval(() => {
//   getgame();
// }, 5e3);
