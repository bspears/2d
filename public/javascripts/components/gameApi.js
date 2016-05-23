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
  textBox(script[0]);
}

function pause(){
  runAnimation.value = false;
}

function unPause(){
  runAnimation.value = true;
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
}

function addLife(character,qty){
  character.lives += qty;
  if(character.lives>character.maxLives){
    character.lives = character.maxLives;
  }
}

function gameOver(){
  //show game over screen
}

function updatePlayerInfo(player){
  playerInfo.innerHTML = '<li class="name">' + player.name + '</li>';
  for(i=0;i<player.lives;i++){
    playerInfo.innerHTML += '<li class="icon"><img src="images/playerLife.png"></li>';
  }
}

function updateInventory(array){
  var inventory = document.getElementById('inventory');
  inventory.innerHTML = '';
  for(i=0; i<array.length;i++){
    inventory.innerHTML += '<li><img src="' + array[i].img.src + '"></li>';
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
    frames++;
  }
  else{
    frames = 1;
  }
  return frames;
}

function playerCollided(object,xpos,ypos,range){
  var distanceY = object.height ? object.height -3 : 27;
  var distanceX = object.width ? object.width - 3 : 27;

  if(range){
    distanceX += range;
    distanceY += range;
  }
  //up and down
  if(ypos - distanceY <= object.YPos && 
    ypos + distanceY > object.YPos  && 
    xpos + distanceX >= object.XPos && 
    xpos - distanceX <= object.XPos){
    return true;
  }
  //sides
  if(xpos - distanceX <= object.XPos && 
    xpos + distanceX > object.XPos  && 
    ypos + distanceY >= object.YPos && 
    ypos - distanceY <= object.YPos){
    return true;
  }
  else{
    return false;
  }
}

function withinRange(obj1,obj2,range){
  //code to detect if one object is in a certain range of another.
}

function animationFlash(obj,frameCounter){
  if(frameCounter%2 === 0){
    obj.animate = false;
  }
  else{
    obj.animate = true;
  }
  return obj;
}

function drawItems(itemCollection) {
  for(var item in itemCollection){
    itemCollection[item].XPos = itemCollection[item].col*tileSize;
    itemCollection[item].YPos = itemCollection[item].row*tileSize;
  }
}

function chestOpen(chest,player){
  if(chest.locked === false){
    chest.open();
    chest.empty = true;
  }
  else if(chest.locked && player.keys.length > 0){
    chest.open();
    chest.empty = true;
    player.keys.pop();
    updateKeys(player);
  }
  else{
    textBox('It\'s locked. Maybe there is a key close by.');
  } 
}

function dropItem(obj){
  var dropChance = randomNumBetween(2);
  switch(dropChance){
    case 1:
      return new Heart({col:obj.XPos/30, row:obj.YPos/30}); 
    case 2:
      return new Money({col:obj.XPos/30, row:obj.YPos/30});
  }
}

function equip(player,item){
  player.equiped = item.name;
  player.attack  = item.attack;
  playerAttack.src = item.imgSrc;
  player.inventory.push(item); 
  return player;
}

// constructors
var Character = function() {
  this.category = "Character";
};

Character.prototype = {
  height:   30,
  width:    30,
  hp:       1,
  xspeed:   0,
  yspeed:   0,
  maxSpeed: 1,
  attack:   1
}

var Enemy = function(options){
  Object.assign(this, options);
  this.hp          = 3;
  this.maxSpeed    = 1;
  this.xspeed      = 0;
  this.yspeed      = 0;
  this.attack      = 1;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

var SkullMan = function(options){
  Object.assign(this,options);
  this.img = monsterImg;
};

SkullMan.prototype = Object.create(Character.prototype);
SkullMan.prototype.constructor = SkullMan;

var Squidy = function(options){
  Object.assign(this,options);
  this.img = squidImg;
};

Squidy.prototype = Object.create(Character.prototype);
Squidy.prototype.constructor = Squidy;

var Npc = function(options){
  Object.assign(this, options);
  this.action    = function(){
    textBox(this.text[0]);
    if(this.item){
      this.item();
      this.item = false;
    }
    else{
      textBox(this.text[1]);
    }
  };
};

Npc.prototype = Object.create(Character.prototype);
Npc.prototype.constructor = Npc;

var Collectable = function(){
};

Collectable.prototype = {
  type:      "undefined",
  qty:       1,
  img:       defaultImg,
  available: true,
  col:       0,
  row:       0
}

var Key = function(options) {
  Object.assign(this,options);
  this.type      = "key";
  this.available = true;
  this.img       = keyImg;
}

Key.prototype = Object.create(Collectable.prototype);
Key.prototype.constructor = Key;

var Weapon = function(options) {
  this.type = "weapon",
  this.attack = 1,
  Object.assign(this,options)
};

Weapon.prototype = Object.create(Collectable.prototype);
Weapon.prototype.constructor = Weapon;

var Heart = function(options) {
  Object.assign(this,options);
  this.type = 'heart';
  this.img  = heartImg;
}

Heart.prototype = Object.create(Collectable.prototype);
Heart.prototype.constructor = Heart;

var HeartContainer = function(options) {
  Object.assign(this,options);
  this.type = 'heartContainer';
  this.img  = heartContainerImg;
}

HeartContainer.prototype = Object.create(Collectable.prototype);
HeartContainer.prototype.constructor = HeartContainer;

var Money = function(options) {
  Object.assign(this,options);
  this.type = 'money';
  this.img  = jewelImg;
}

Money.prototype = Object.create(Collectable.prototype);
Money.prototype.constructor = Money;

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

var Door = function(options) {
  Object.assign(this,options);
};

Door.prototype = {
  dest: "null",
  col: 0,
  row: 0,
  available: true,
  destX: 0,
  destY: 0
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
      levels.level1.collectables.push(new Collectable('fish',1,fishImg,true,dropX,dropY,'Fish'));
    }
    else{
      textBox('Better luck next time.');
    }
  };
};

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
  if(player.direction == "up" && 
    playerYPos <= obj.YPos + 50 && 
    playerYPos > obj.YPos && 
    playerXPos <= obj.XPos + 15 && 
    playerXPos >= obj.XPos - 15 ){
    obj.action();  
  }
  //down action
  if(player.direction == "down" && 
    playerYPos >= obj.YPos - 50 && 
    playerYPos < obj.YPos && 
    playerXPos <= obj.XPos + 15 && 
    playerXPos >= obj.XPos - 15 ){
    obj.action(); 
  }
  // //right action
  if(player.direction == "right" && 
    playerXPos >= obj.XPos - 50 && 
    playerXPos < obj.XPos && 
    playerYPos <= obj.YPos + 15 && 
    playerYPos >= obj.YPos - 15 ){
    obj.action(); 
  }
  // //left action
  if(player.direction == "left" && 
    playerXPos <= obj.XPos + 50 && 
    playerXPos > obj.XPos && 
    playerYPos <= obj.YPos + 15 && 
    playerYPos >= obj.YPos - 15 ){
    obj.action(); 
  }
}
