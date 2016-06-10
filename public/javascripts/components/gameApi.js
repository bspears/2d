// var pubsub = require('./pubsub');
var playerInfo = document.getElementById('playerInfo');
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
  var items = " ";

  for(i=0; i<array.length;i++){
    items += '<li><img src="' + array[i].img.src + '"></li>';
  }
  return items;
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
  var xRange = obj1.XPos - obj2.XPos;
  var yRange = obj1.YPos - obj2.YPos;

  if(Math.abs(xRange) <= range &&
     Math.abs(yRange) <= range){
    return true;
  } else {
    return false;
  }
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

var GameObject = function(options) {
  Object.assign(this, options);
}

GameObject.prototype = {
  height:    30,
  width:     30,
  col:       0,
  row:       0,
  XPos:      0,
  YPos:      0,
  available: true,
  updatePos: function() {
    this.XPos = this.col * tileSize;
    this.YPos = this.row * tileSize;
  }
}

var Character = function(options) {
  this.hp = 1;
  this.xspeed = 0;
  this.yspeed = 0;
  this.maxSpeed = 0;
  this.attack = 0;
  GameObject.call(this, options);
  this.takeDamage = function(value) {
    this.hp -= value;
  };
};

Character.prototype = Object.create(GameObject.prototype);
Character.prototype.constructor = Character;

var Enemy = function(options){
  Character.call(this, options);
  this.hp          = 3;
  this.maxSpeed    = 1;
  this.xspeed      = 0;
  this.yspeed      = 0;
  this.attack      = 1;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

var SkullMan = function(options){
  Enemy.call(this, options);
  this.img = monsterImg;
  this.ai  = "walker";
};

SkullMan.prototype = Object.create(Enemy.prototype);
SkullMan.prototype.constructor = SkullMan;

var Squidy = function(options){
  Enemy.call(this, options);
  this.img      = squidImg;
  this.ai       = "seeker";
  this.maxSpeed = 2;
};

Squidy.prototype = Object.create(Enemy.prototype);
Squidy.prototype.constructor = Squidy;

var Npc = function(options){
  Character.call(this, options);
};

Npc.prototype = Object.create(Character.prototype);
Npc.prototype.constructor = Npc;
Npc.prototype.action = function(){
    textBox(this.text[0]);
    if(this.item){
      this.item();
      this.item = false;
    }
    else{
      textBox(this.text[1]);
    }
  };

var Collectable = function(options){
  this.type = "undefined";
  this.qty = 1;
  this.img = defaultImg;
  GameObject.call(this,options);
};

Collectable.prototype = Object.create(GameObject.prototype);
Collectable.prototype.constructor = Collectable;

var Key = function(options) {
  Collectable.call(this,options);
  this.type      = "key";
  this.img       = keyImg;
}

Key.prototype = Object.create(Collectable.prototype);
Key.prototype.constructor = Key;

var Weapon = function(options) {
  Collectable.call(this,options),
  this.type = "weapon"
};

Weapon.prototype = Object.create(Collectable.prototype);
Weapon.prototype.constructor = Weapon;

var Heart = function(options) {
  Collectable.call(this,options);
  this.type = 'heart';
  this.img  = heartImg;
}

Heart.prototype = Object.create(Collectable.prototype);
Heart.prototype.constructor = Heart;

var HeartContainer = function(options) {
  Collectable.call(this,options);
  this.type = 'heartContainer';
  this.img  = heartContainerImg;
}

HeartContainer.prototype = Object.create(Collectable.prototype);
HeartContainer.prototype.constructor = HeartContainer;

var Money = function(options) {
  Collectable.call(this,options);
  this.type = 'money';
  this.img  = jewelImg;
}

Money.prototype = Object.create(Collectable.prototype);
Money.prototype.constructor = Money;

var Chest = function Chest(options){
  this.img       = chestImg;
  this.locked    = false;
  this.contents  = undefined;
  this.empty     = false;
  GameObject.call(this, options);
};

Chest.prototype = Object.create(GameObject.prototype);
Chest.prototype.constructor = Chest;
Chest.prototype.open = function(){
    this.contents();
    this.contents = null;
  };

var Door = function(options) {
  this.dest = "null";
  this.destX = 0;
  this.destY = 0;
  GameObject.call(this,options);
};

Door.prototype = Object.create(GameObject.prototype);
Door.prototype.constructor = Door;

// var FishingPond = function Pond(col,row){
//   this.col = col;
//   this.row = row;
//   this.YPos = row*tileSize;
//   this.XPos = col*=tileSize;
//   this.available = true;
//   this.action = function(){
//     dropX = this.col;
//     dropY = this.row + 2;
    
//     if(randomNumBetween(4) == 4){
//       textBox('You caught a Mimi fish!');
//       levels.level1.collectables.push(new Collectable('fish',1,fishImg,true,dropX,dropY,'Fish'));
//     }
//     else{
//       textBox('Better luck next time.');
//     }
//   };
// };

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
  //right action
  if(player.direction == "right" && 
    playerXPos >= obj.XPos - 50 && 
    playerXPos < obj.XPos && 
    playerYPos <= obj.YPos + 15 && 
    playerYPos >= obj.YPos - 15 ){
    obj.action(); 
  }
  //left action
  if(player.direction == "left" && 
    playerXPos <= obj.XPos + 50 && 
    playerXPos > obj.XPos && 
    playerYPos <= obj.YPos + 15 && 
    playerYPos >= obj.YPos - 15 ){
    obj.action(); 
  }
}
