var playerInfo = document.getElementById('playerInfo');
var inventory = document.getElementById('inventory');
var bank = document.getElementById('bank');


function loseLife(character, enemy){
  character.lives -= enemy.attack;
  console.log('working');
};

function addLife(character,qty){
	character.lives += qty;
}

function gameOver(){
  //show game over screen
}

function updatePlayerInfo(player){
    playerInfo.innerHTML = '<li class="name">'+player.name+'</li>';
    for(i=0;i<player.lives;i++){
      playerInfo.innerHTML += '<li class="icon"><img src="images/playerLife.png"></li>'
    }
  }

function updateInventory(array){
	for(i=0; i<array.length;i++){
		inventory.innerHTML += '<li><img src="'+ array[i].img.src +'"></li>';
	}
}  

function updateBank(target,value){
	target += value;
	bank.innerHTML = '<span><img src="images/jewel.png"> x ' + target + '</span>';
	
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

function playerCollided(object,xpos,ypos){
	if(ypos/object.YPos >= .92 && ypos/object.YPos < 1.06 &&
          xpos/object.XPos >= .92 && xpos/object.XPos < 1.06){
        return true;
      }
}