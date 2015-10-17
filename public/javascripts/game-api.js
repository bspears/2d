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

function frameCounter(frames){
	if(frames < 60){
		frames++
	}
	else{
		frames = 1;
	}
	return frames;
}

function forFrames(numberOfFrames){
	if(numberOfFrames == 0){
		return false;
	}else if(numberOfFrames >= 1){
		numberOfFrames -= 1;
		console.log(numberOfFrames);
		return forFrames(numberOfFrames);
	}
}