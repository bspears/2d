var playerInfo = document.getElementById('playerInfo');
var inventory = document.getElementById('inventory');
var bank = document.getElementById('bank');
var tileSize = 30;
var textDisplay = {
  "value": false
};
var runAnimation = {
  "value": true
};

function randomNumBetween(highestNumber){
	return Math.ceil(Math.random() * highestNumber);
}

function runScript(script){
  textBox(script[0])
}

function changeState(gameState,value){
  gameState.value = value;
}

function removeFromArray(array,obj){
	var index = array.indexOf(obj);
	array.splice(index,1);
	return array;
}

function loseLife(character, enemy){
  character.lives -= enemy.attack;
};

function addLife(character,qty){
	character.lives += qty;
	if(character.lives>character.maxLives){
		character.lives = character.maxLives;
	}
}

function loadLevel(level){
  var currentLevel = {
    "background"   : level.background,
    "map"          : level.map,
    "cols"         : level.cols,
    "rows"         : level.rows,
    "playerCol"    : level.playerCol,
    "playerRow"    : level.playerRow,
    "enemies"      : level.enemies,
    "npcs"         : level.npcs,
    "collectables" : level.collectables,
    "chests"       : level.chests,
    "areas"        : level.areas,
    "doors"        : level.doors,
    "secrets"      : level.secrets,
    "ponds"        : level.ponds
  }
  return currentLevel
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
  var inventory = document.getElementById('inventory');
  inventory.innerHTML = '';
	for(i=0; i<array.length;i++){
		inventory.innerHTML += '<li><img src="'+ array[i].img.src +'"></li>';
	}
} 

function updateKeys(player){
  keys.innerHTML = '<span><img src="images/keyImg.png"> x ' + player.keys.length + '</span>';
} 

function updateBank(target,value){
	target += value; 
	bank.innerHTML = '<span><img src="images/jewel.png"> x ' + target + '</span>';
	return target;
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

function playerCollided(object,xpos,ypos,range){
  var distance = 27;
  if(range){distance += range}
  //up and down
  if(ypos - distance <= object.YPos && ypos + distance > object.YPos  && xpos + distance >= object.XPos && xpos - distance <= object.XPos){
		return true;
	}
	//sides
	if(xpos - distance <= object.XPos && xpos + distance > object.XPos  && ypos + distance >= object.YPos && ypos - distance <= object.YPos){
		return true;
	}
  else{
    return false;
  }
}

function withinRange(obj1,obj2,range){
  
}

function animationFlash(obj,frameCounter){
	if(frameCounter%2 == 0){
		obj.animate = false;
	}
	else{
		obj.animate = true;
	}
	console.log('flash')
	return obj;
}

function chestOpen(chest,player){
  if(chest.locked == false){
    chest.open();
    chest.empty = true;
  }
  else if(chest.locked && player.keys.length > 0){
    chest.open();
    chest.empty = true;
    player.keys.pop();
    updateKeys(player);
    console.log(player.keys.length)
  }
  else{
    textBox('It\'s locked. Maybe there is a key close by.');
  } 
}

function dropItem(obj){
	var dropChance = randomNumBetween(2);
	switch(dropChance){
		case 1:
			return new Collectable('heart',2, heartImg,true,obj.XPos/30,obj.YPos/30); 
			break
		case 2:
			return new Collectable('money',1,jewelImg,true,obj.XPos/30,obj.YPos/30);
      break;
	}
}

function equip(player,item){
  player.equiped = item.name;
  player.attack  = item.attack;
  playerAttack.src = item.imgSrc;
  player.inventory.push(item); 
  console.log(player.inventory)
  return player;
}

// constructors

var Enemy = function Enemy(enemyType,col,row,specialItem){
  this.enemyType   = enemyType;
  this.col         = col;
  this.row         = row;
  this.hp          = 3;
  this.xspeed      = 0;
  this.yspeed      = 0;
  this.maxSpeed    = 1;
  this.attack      = 1;
  this.YPos        = row*tileSize;
  this.XPos        = col*=tileSize;
  this.specialItem = specialItem;
}

var Enemy2 = function Enemy(enemyType,col,row,specialItem){
  this.enemyType   = enemyType;
  this.col         = col;
  this.row         = row;
  this.hp          = 5;
  this.xspeed      = 0;
  this.yspeed      = 0;
  this.maxSpeed    = 1.5;
  this.attack      = 2;
  this.YPos        = row*tileSize;
  this.XPos        = col*=tileSize;
  this.specialItem = specialItem;
}

var Npc = function Npc(img,col,row,available,text,item){
  this.img       = img;
  this.col       = col;
  this.row       = row;
  this.available = available;
  this.YPos      = row*tileSize;
  this.XPos      = col*tileSize;
  this.text      = text;
  this.item      = item;
  this.action    = function(){
    textBox(this.text[0]);
    if(this.item){
      item();
      this.item = false;
    }
    else{
      textBox(this.text[1]);
    }
  }
}

var Collectable = function Item(type,qty,img,available,col,row,name){
  this.type      = type;
  this.qty       = qty;
  this.img       = img;
  this.col       = col;
  this.row       = row;
  this.YPos      = row*tileSize;
  this.XPos      = col*=tileSize;
  this.available = available;
  this.name      = name;
}

var Weapon = function Item(type,name,imgSrc,qty,img,available,col,row,attack){
  this.type      = type;
  this.name      = name;
  this.imgSrc    = imgSrc;
  this.qty       = qty;
  this.img       = img;
  this.col       = col;
  this.row       = row;
  this.YPos      = row*tileSize;
  this.XPos      = col*=tileSize;
  this.available = available;
  this.attack    = attack;
}

var Chest = function Chest(img,col,row,locked,contents){
  this.img       = img;
  this.col       = col;
  this.row       = row;
  this.locked    = locked;
  this.contents  = contents;
  this.available = true;
  this.YPos      = row*tileSize;
  this.XPos      = col*=tileSize;
  this.empty     = false;
  this.open      = function(){
    contents();
    contents = null;
  };
};

var SecretDoor = function SecretDoor(img,col,row,available,name){
  this.img       = img;
  this.col       = col;
  this.row       = row;
  this.name      = name;
  this.YPos      = row*tileSize;
  this.XPos      = col*=tileSize;
  this.available = available;
  this.action    = function(){
    this.available = false;
  };
  console.log(this);
}

var Door = function Door(area,col,row,returnX,returnY){
  this.col     = col;
  this.row     = row;
  this.area    = area;
  this.YPos    = row*tileSize;
  this.XPos    = col*=tileSize;
  this.returnX = returnX;
  this.returnY = returnY;
}

var FishingPond = function Pond(col,row){
  this.col = col;
  this.row = row;
  this.YPos = row*tileSize;
  this.XPos = col*=tileSize;
  this.available = true;
  this.action = function(){
    dropX = this.col;
    dropY = this.row + 2;
    
    if(randomNumBetween(4) == 4){
      textBox('You caught a Mimi fish!');
      levels.level1.collectables.push(new Collectable('fish',1,fishImg,true,dropX,dropY,'Fish'))
    }
    else{
      textBox('Better luck next time.');
    }
  };
}

function pause(){
  runAnimation.value = false;
}

function unPause(){
  runAnimation.value = true;
}

// text box
function textBox(text){
	var box = document.getElementById('textBox');
	box.innerHTML = '<div class="textBoxContent">' + text + '</div>';
  pause();
  textDisplay.value = true;
}

function clearTextBox(){
	var box = document.getElementById('textBox');
	box.innerHTML = '';
  unPause();
  textDisplay.value = false;
}

function action(obj,player,playerXPos,playerYPos){
  //up action
  if(player.direction == "up" && playerYPos <= obj.YPos + 50 && playerYPos > obj.YPos && playerXPos <= obj.XPos + 15 && playerXPos >= obj.XPos - 15 ){
    obj.action();  
  }
  //down action
  if(player.direction == "down" && playerYPos >= obj.YPos - 50 && playerYPos < obj.YPos && playerXPos <= obj.XPos + 15 && playerXPos >= obj.XPos - 15 ){
    obj.action(); 
  }
  // //right action
  if(player.direction == "right" && playerXPos >= obj.XPos - 50 && playerXPos < obj.XPos && playerYPos <= obj.YPos + 15 && playerYPos >= obj.YPos - 15 ){
    obj.action(); 
  }
  // //left action
  if(player.direction == "left" && playerXPos <= obj.XPos + 50 && playerXPos > obj.XPos && playerYPos <= obj.YPos + 15 && playerYPos >= obj.YPos - 15 ){
    obj.action(); 
  }
}



