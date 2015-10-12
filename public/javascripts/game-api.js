var playerInfo = document.getElementById('playerInfo'),innerHTML;


function loseLife(character, enemy){
  character.lives -= enemy.attack;
  console.log('working');
};

function gameOver(){
  //show game over screen
}

function updatePlayerInfo(player){
    playerInfo.innerHTML = '<li class="name">'+player.name+'</li>';
    for(i=0;i<player.lives;i++){
      playerInfo.innerHTML += '<li class="icon"><img src="images/playerLife.png"></li>'
    }
  }
