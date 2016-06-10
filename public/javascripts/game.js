(function() {
  
  //dependencies 
  var gameApi    = require('./components/gameApi');
  var assets     = require('./components/assets');
  var levels     = require('./components/levels');
  var playerData = require('./components/player.js');
  var pubsubData = require('./components/pubsub');
  var enemyAi    = require('./components/ai');

  //game elements
  var thisLevel      = levels.level1;
  var thisBackground = document.getElementById('background');
  var port           = document.getElementById('viewport');
  var canvas         = document.getElementById('canvas');
  var canvas2        = document.getElementById('animation');
  var context        = canvas.getContext('2d');
  var context2       = canvas2.getContext('2d');
  var player         = new Character(playerData);
  var pubsub         = pubsubData();
  var ai             = enemyAi();

  //HUD elements
  var lives      = document.getElementById('lives');
  var playerInfo = document.getElementById('playerInfo');
  var inventory  = document.getElementById('inventory');
  var bank       = document.getElementById('bank');
  
  //states
  var leftScroll       = port.scrollLeft;
  var scrollTop        = port.scrollTop;
  var gameState        = { 'value':'play' };
  var backgroundRender = false;
  var recoverCount     = 0;
  var tileSize         = 30;
  var leftPressed      = false;
  var rightPressed     = false;
  var upPressed        = false;
  var downPressed      = false;
  var actionPressed    = false;
  var frameCount       = 0;
  var pace             = 0;
  var tick             = 0;


  //player initial positioning
  player.row = thisLevel.playerRow;
  player.col = thisLevel.playerCol;
  player.updatePos();

  //give all objects initial position values
  for(var object in thisLevel.GameObjects){
    var objects = thisLevel.GameObjects[object];

    for(item in objects) {
      objects[item].updatePos();
    }
  }

  //Key mapping
  document.addEventListener('keydown', function(e){
    switch(e.keyCode){
      case 65:
        leftPressed = true;
        player.direction = "left";
        break;
      case 87:
        upPressed = true;
        player.direction = "up";
        break;
      case 68:
        rightPressed = true;
        player.direction = "right";
        break;
      case 83:
        downPressed = true;
        player.direction = "down";
        break;
      case 16:
        if(tick < 10){
          player.attacking = true;
        }
        break;      
      case 191:
        if(textDisplay.value){
          actionPressed = false;
          clearTextBox();
          updateGame();
        }
        else{
          actionPressed = true;
        }
        break;  
    }
  }, false);

  document.addEventListener('keyup', function(e){
    switch(e.keyCode){
      case 65:
        leftPressed = false;
        break;
      case 87:
        upPressed = false;
        break;
      case 68:
        rightPressed = false;
        break;
      case 83:
        downPressed = false;
        break;
      case 16:
        player.attacking = false;
        tick = 0;
        break;
      case 191:
        actionPressed = false;
        break;  
    }
  }, false);

  //build level
  function renderBackground(){
    background.innerHTML = '<img src="images/'+ thisLevel.background +'">';
    canvas.width         = tileSize*thisLevel.cols;
    canvas.height        = tileSize*thisLevel.rows;
    canvas2.width        = tileSize*thisLevel.cols;
    canvas2.height       = tileSize*thisLevel.rows;
    port.scrollTop       = player.YPos;
    port.scrollLeft      = player.XPos-500;
    inventory.innerHTML  = updateInventory(player.inventory);
    context2.clearRect(0,0, canvas2.width, canvas2.height);

    //water
    waterImg.onload = function(){
      for(var i=0;i<thisLevel.rows;i++){
        for(var j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==3){
            context2.drawImage(waterImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    };

    //walls
    greenHillImg.onload = function(){
      for(var i=0;i<thisLevel.rows;i++){
        for(var j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==1){
            context2.drawImage(greenHillImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    };

    //bushes
    bushImg.onload = function(){
      for(var i=0;i<thisLevel.rows;i++){
        for(var j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==4){
            context2.drawImage(bushImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    };

    //forrest tree
    forrestTree1Img.onload = function(){
      for(var i=0;i<thisLevel.rows;i++){
        for(var j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==5){
            context2.drawImage(forrestTree1Img,0,30,30,60,j*tileSize,i*tileSize,tileSize,60);
          }
        }
      }
    };

    //rockyTops
    hillTopImg.onload = function(){
      for(var i=0;i<thisLevel.rows;i++){
        for(var j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==2){
            context2.drawImage(hillTopImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    };
  }

  function reRender(){
    background.innerHTML = '<img src="images/'+ thisLevel.background +'">';
    canvas.width         = tileSize*thisLevel.cols;
    canvas.height        = tileSize*thisLevel.rows;
    canvas2.width        = tileSize*thisLevel.cols;
    canvas2.height       = tileSize*thisLevel.rows;
    port.scrollTop       = player.YPos;
    port.scrollLeft      = player.XPos-500;
    context2.clearRect(0,0, canvas2.width, canvas2.height);

    player.updatePos();

    //update game object locations
    for(var object in thisLevel.GameObjects){
      var objects = thisLevel.GameObjects[object];

      for(item in objects) {
        objects[item].updatePos();
      }
    }

    //water
    for(var i=0;i<thisLevel.rows;i++){
      for(j=0;j<thisLevel.cols;j++){
        if(thisLevel.map[i][j]==3){
          context2.drawImage(waterImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //walls
    for(i=0;i<thisLevel.rows;i++){
      for(j=0;j<thisLevel.cols;j++){
        if(thisLevel.map[i][j]==1){
          context2.drawImage(greenHillImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //bushes
    for(i=0;i<thisLevel.rows;i++){
      for(j=0;j<thisLevel.cols;j++){
        if(thisLevel.map[i][j]==4){
          context2.drawImage(bushImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //forrest tree
    for(i=0;i<thisLevel.rows;i++){
      for(j=0;j<thisLevel.cols;j++){
        if(thisLevel.map[i][j]==5){
          context2.drawImage(forrestTree1Img,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //rockyTops
    for(i=0;i<thisLevel.rows;i++){
      for(j=0;j<thisLevel.cols;j++){
        if(thisLevel.map[i][j]==2){
          context2.drawImage(hillTopImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }
  }

  function renderLevel(){
    context.clearRect(0,0, canvas.width, canvas.height);

    //draw each game object
    for(object in thisLevel.GameObjects){
      var objects = thisLevel.GameObjects[object];

      for(object in objects){
        var item   = objects[object];
        var width  = item.width ? item.width : 30;
        var height = item.height ? item.height : 30;

        if(item.img && item.available) {
          context.drawImage(item.img,0,0,width,height,item.XPos,item.YPos,width,height);
        }
      }
    }

    //player
    if(player.animate && player.attacking === false){
      if(player.direction === "up"){
        context.drawImage(playerRunUp,runUpFrame.x,runUpFrame.y,30,30,player.XPos,player.YPos,30,30); 
      }
      if(player.direction === "down"){
        context.drawImage(playerRunDown,runDownFrame.x,runDownFrame.y,30,30,player.XPos,player.YPos,30,30); 
      }
      if(player.direction === "right"){
        context.drawImage(playerRunRight,runRightFrame.x,runRightFrame.y,30,30,player.XPos,player.YPos,30,30); 
      }
      if(player.direction === "left"){
        context.drawImage(playerRunLeft,runLeftFrame.x,runLeftFrame.y,30,30,player.XPos,player.YPos,30,30); 
      }
    }
    else if(player.attacking || player.fishing){
      if(player.direction === "up"){
        context.drawImage(attackMove,0,0,30,30,player.XPos,player.YPos,30,30); 
      }
      if(player.direction === "down"){
        context.drawImage(attackMove,60,0,30,30,player.XPos,player.YPos,30,30); 
      }
      if(player.direction === "right"){
        context.drawImage(attackMove,30,0,30,30,player.XPos,player.YPos,30,30); 
      }
      if(player.direction === "left"){
        context.drawImage(attackMove,90,0,30,30,player.XPos,player.YPos,30,30); 
      }
    }

    if(player.attacking){
      if(tick < 10){
        switch(player.direction){
          case "up":
            context.drawImage(playerAttack,attackFrame.x,attackFrame.y,30,30,player.XPos,player.YPos-30,30,30);
            tick += 1;
            break;
          case "right":
            context.drawImage(playerAttack,attackFrame.x+30,attackFrame.y,30,30,player.XPos+30,player.YPos,30,30);
            tick += 1;
            break;
          case "down":
            context.drawImage(playerAttack,attackFrame.x+60,attackFrame.y,30,30,player.XPos,player.YPos+30,30,30);
            tick += 1; 
            break;
          case "left":
            context.drawImage(playerAttack,attackFrame.x+90,attackFrame.y,30,30,player.XPos-30,player.YPos,30,30);
            tick += 1; 
            break;
        }
      }
      else if(tick <= 7){
        tick += 1;
      }
    }

    if(player.fishing){
      switch(player.direction){
        case "up":
          context.drawImage(playerAttack,attackFrame.x,attackFrame.y,30,30,player.XPos,player.YPos-30,30,30);
          break;
        case "right":
          context.drawImage(playerAttack,attackFrame.x+30,attackFrame.y,30,30,player.XPos+30,player.YPos,30,30);
          break;
        case "down":
          context.drawImage(playerAttack,attackFrame.x+60,attackFrame.y,30,30,player.XPos,player.YPos+30,30,30);
          break;
        case "left":
          context.drawImage(playerAttack,attackFrame.x+90,attackFrame.y,30,30,player.XPos-30,player.YPos,30,30);
          break;
      }   
    }
  }

  //Frame rate 
  window.requestAnimFrame = (function(callback) {
  return window.requestAnimFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         function(callback) {
          window.setTimeout(callback, 1000/60);
        };
  }) ();

  function updateGame() {
    //update player lives and stats
    updatePlayerInfo(player);
    
    //60 frame loop
    frameCount = frameCounter(frameCount);
    player.yspeed = 0;
    player.xspeed = 0;

    //player movement
    if(rightPressed && player.attacking === false && player.fishing === false){
      player.xspeed=player.maxSpeed;
      if(runRightFrame.x < 61){
        if(frameCount%10 === 0){
          runRightFrame.x += 30;
        }
      }
      if(runRightFrame.x>60){
        runRightFrame.x = 0;
      }
    }
    else{
      if(leftPressed && player.attacking === false && player.fishing === false){
        player.xspeed=-player.maxSpeed;
        if(runLeftFrame.x < 61){
          if(frameCount%10 === 0){
            runLeftFrame.x += 30;
          }
        }
        if(runLeftFrame.x>60){
          runLeftFrame.x = 0;
        }
      }
      else{
        if(upPressed && player.attacking === false && player.fishing === false){
          player.yspeed=-player.maxSpeed;
          if(runUpFrame.x < 61){
            if(frameCount%10 === 0){
              runUpFrame.x += 30;
            }
          }
          if(runUpFrame.x>60){
            runUpFrame.x = 30;
          }
        }
        else{
          if(downPressed && player.attacking === false && player.fishing === false){
            player.yspeed=player.maxSpeed;
            if(runDownFrame.x < 61){
              if(frameCount%10 === 0){
                runDownFrame.x += 30;
              }
            }
            if(runDownFrame.x>60){
            runDownFrame.x = 30;
            }
          }
        }
      }
    }

    if(player.yspeed <0){
      player.direction = "up";
    }
    if(player.yspeed >0){
      player.direction = "down";
    }
    if(player.xspeed <0){
      player.direction = "left";
    }
    if(player.xspeed >0){
      player.direction = "right";
    }

    player.XPos+=player.xspeed;
    player.YPos+=player.yspeed;

    //scrolling
    port.scrollTop = player.YPos-250;
    port.scrollLeft = player.XPos-450;

    //enemy intelligence
    for(enemy in thisLevel.GameObjects.enemies){
      var thisEnemy = thisLevel.GameObjects.enemies[enemy];
      var thisAi    = thisEnemy.ai;

      ai[thisAi](thisEnemy, pace, player);
      thisEnemy.XPos+=thisEnemy.xspeed;
      thisEnemy.YPos+=thisEnemy.yspeed;
    }
    
    if(pace === 211) {
      pace = 0;
    }

    pace++;

    //collision
    (function playerCollision() {
      var baseCol    = Math.floor(player.XPos/tileSize);
      var baseRow    = Math.floor(player.YPos/tileSize);
      var colOverlap = player.XPos%tileSize;
      var rowOverlap = player.YPos%tileSize;

      //Horzontal collision
      if(player.xspeed>0){
        if((thisLevel.map[baseRow][baseCol+1]>0 && !thisLevel.map[baseRow][baseCol]) ||
           (thisLevel.map[baseRow+1][baseCol+1]>0 && !thisLevel.map[baseRow+1][baseCol] && rowOverlap)){
          player.XPos=baseCol*tileSize;
        }
      }

      if(player.xspeed<0){
        if((!thisLevel.map[baseRow][baseCol+1]>0 && thisLevel.map[baseRow][baseCol]) ||
           (!thisLevel.map[baseRow+1][baseCol+1]>0 && thisLevel.map[baseRow+1][baseCol] && rowOverlap)){
          player.XPos=(baseCol+1)*tileSize;
        }
      }

      //Vertical collision
      if(player.yspeed>0){
        if((thisLevel.map[baseRow+1][baseCol]>0 && !thisLevel.map[baseRow][baseCol]) ||
           (thisLevel.map[baseRow+1][baseCol+1]>0 && !thisLevel.map[baseRow][baseCol+1] && colOverlap)){
          player.YPos = baseRow*tileSize;
        }
      }

      if(player.yspeed<0){
        if((!thisLevel.map[baseRow+1][baseCol]>0 && thisLevel.map[baseRow][baseCol]) ||
           (!thisLevel.map[baseRow+1][baseCol+1]>0 && thisLevel.map[baseRow][baseCol+1] && rowOverlap)){
          player.YPos=(baseRow+1)*tileSize;
        }
      }
    }) ();  

    //object collision
    for(var chest in thisLevel.GameObjects.chests){
      var thisChest = thisLevel.GameObjects.chests[chest];
      if(playerCollided(thisChest,player.XPos,player.YPos)){
        if(player.yspeed<0){
          player.YPos=thisChest.YPos+tileSize;
        }
        if(player.yspeed>0){
          player.YPos=thisChest.YPos-tileSize;
        }
        if(player.xspeed>0){
          player.XPos=thisChest.XPos-tileSize;
        }
        if(player.xspeed<0){
          player.XPos=thisChest.XPos+tileSize;
        }
      }    
    }

    for(var npc in thisLevel.GameObjects.npcs){
      var thisnpc = thisLevel.GameObjects.npcs[npc];
      if(playerCollided(thisnpc,player.XPos,player.YPos)){
        if(player.yspeed<0){
          player.YPos=thisnpc.YPos+tileSize;
        }
        if(player.yspeed>0){
          player.YPos=thisnpc.YPos-tileSize;
        }
        if(player.xspeed>0){
          player.XPos=thisnpc.XPos-tileSize;
        }
        if(player.xspeed<0){
          player.XPos=thisnpc.XPos+tileSize;
        }
      }    
    }
    
    //enemy collision
    //Horzontal collision

      for(enemy in thisLevel.GameObjects.enemies){
        var thisEnemy  = thisLevel.GameObjects.enemies[enemy];
        var baseCol    = Math.floor(thisEnemy.XPos/tileSize);
        var baseRow    = Math.floor(thisEnemy.YPos/tileSize);
        var colOverlap = thisEnemy.XPos%tileSize;
        var rowOverlap = thisEnemy.YPos%tileSize;
    
        if(thisEnemy.xspeed>0){
          if((thisLevel.map[baseRow][baseCol+1] && !thisLevel.map[baseRow][baseCol]) ||
             (thisLevel.map[baseRow+1][baseCol+1] && !thisLevel.map[baseRow+1][baseCol] && rowOverlap)){
            thisEnemy.XPos=baseCol*tileSize;
          }
        }
    
        if(thisEnemy.xspeed<0){
          if((!thisLevel.map[baseRow][baseCol+1] && thisLevel.map[baseRow][baseCol]) ||
             (!thisLevel.map[baseRow+1][baseCol+1] && thisLevel.map[baseRow+1][baseCol] && rowOverlap)){
            thisEnemy.XPos=(baseCol+1)*tileSize;
          }
        }
    
        //Vertical collision
        if(thisEnemy.yspeed>0){
          if((thisLevel.map[baseRow+1][baseCol] && !thisLevel.map[baseRow][baseCol]) ||
            (thisLevel.map[baseRow+1][baseCol+1] && !thisLevel.map[baseRow][baseCol+1] && colOverlap)){
            thisEnemy.YPos = baseRow*tileSize;
          }
        }
    
        if(thisEnemy.yspeed<0){
          if((!thisLevel.map[baseRow+1][baseCol] && thisLevel.map[baseRow][baseCol]) ||
            (!thisLevel.map[baseRow+1][baseCol+1] && thisLevel.map[baseRow][baseCol+1] && rowOverlap)){
            thisEnemy.YPos=(baseRow+1)*tileSize;
          }
        }
      }

    //item pick up
    for(var item in thisLevel.GameObjects.collectables){
      if(thisLevel.GameObjects.collectables[item].available && playerCollided(thisLevel.GameObjects.collectables[item],player.XPos,player.YPos)){
        thisLevel.GameObjects.collectables[item].available = false;
        switch(thisLevel.GameObjects.collectables[item].type){
          case "heart":
            addLife(player,thisLevel.GameObjects.collectables[item].qty);
            break;
          case "heartContainer":
            addLife(player,thisLevel.GameObjects.collectables[item].qty);
            player.maxLives += 1;
            player.lives = player.maxLives;
            textBox('"I feel stronger somehow..."');
            break;
          case "weapon":
            player = equip(player,thisLevel.GameObjects.collectables[item]);
            updateInventory(player.inventory);
            inventory.innerHTML = updateInventory(player.inventory);
            break;
          case "key":
            player.keys.push(thisLevel.GameObjects.collectables[item]);
            updateKeys(player);
            break;
          case "money":
            player.bank = updateBank(player.bank, thisLevel.GameObjects.collectables[item].qty);
            break;
          case "relic":
            player.inventory.push(thisLevel.GameObjects.collectables[item]);
            inventory.innerHTML = updateInventory(player.inventory);
            textBox('It\'s a strange metal bar. It looks like it was meant to have some sort of function.' );
            break;
          case "fish":
            player.inventory.push(thisLevel.GameObjects.collectables[item]);
            updateInventory(player.inventory);
            break;
        }
        if(thisLevel.GameObjects.collectables[item].name === 'end'){
          thisLevel = levels.level2;
          reRender();
        } 
      }
    }  

    //damage
    for(var enemy in thisLevel.GameObjects.enemies){  
      if(playerCollided(thisLevel.GameObjects.enemies[enemy],player.XPos,player.YPos) && player.recovering === false){
        //take damage
        loseLife(player,thisLevel.GameObjects.enemies[enemy]);
        player.recovering = true;
        //bump backward
        if(player.xspeed < 0 || thisLevel.GameObjects.enemies[enemy].xspeed > 0 && player.yspeed === 0){
          player.XPos += 80;
        }
        else if(player.xspeed > 0 || thisLevel.GameObjects.enemies[enemy].xspeed < 0 && player.yspeed === 0){
          player.XPos -= 80;
        }
        else if(player.yspeed > 0 || thisLevel.GameObjects.enemies[enemy].yspeed < 0){
          player.YPos -= 80;
        }
        else if(player.yspeed < 0 || thisLevel.GameObjects.enemies[enemy].yspeed > 0){
          player.YPos += 80;
        }
      }
    } 

    if(player.recovering === true){
      recoverCount += 1;
      animationFlash(player,frameCount);
      if(recoverCount === 60){
        player.recovering = false;
        recoverCount = 0;
        player.animate = true;
      }
    }

    if(player.lives<=0){
      runAnimation.value = false;
      textBox('Game Over');
    } 

    //attack
    if(player.attacking && tick > 2 && tick < 4){
      for(var enemy in thisLevel.GameObjects.enemies){
        var thisEnemy = thisLevel.GameObjects.enemies[enemy];
        //up attack
        if(player.direction === "up" && 
          player.YPos - 53 <= thisEnemy.YPos && 
          player.YPos > thisEnemy.YPos && 
          player.XPos + 29 >= thisEnemy.XPos && 
          player.XPos - 29 <= thisEnemy.XPos ){
          thisEnemy.takeDamage(player.attack);
          thisEnemy.YPos -= 20;
          console.log(player.attack);
        }
        //down attack
        if(player.direction === "down" && 
          player.YPos + 53 > thisEnemy.YPos  && 
          player.YPos < thisEnemy.YPos && 
          player.XPos + 29 >= thisEnemy.XPos && 
          player.XPos - 29 <= thisEnemy.XPos ){
          thisEnemy.takeDamage(player.attack);
          thisEnemy.YPos += 20;
        }
        // //right attack
        if(player.direction === "right" && 
          player.XPos + 53 >= thisEnemy.XPos && 
          player.XPos < thisEnemy.XPos && 
          player.YPos + 29 >= thisEnemy.YPos && 
          player.YPos - 29 <= thisEnemy.YPos ){
          thisEnemy.takeDamage(player.attack);
          thisEnemy.XPos += 20;
        }
        // //left attack
        if(player.direction === "left" && 
          player.XPos - 53 <= thisEnemy.XPos && 
          player.XPos > thisEnemy.XPos && 
          player.YPos + 29 >= thisEnemy.YPos && 
          player.YPos - 29 <= thisEnemy.YPos ){
          thisEnemy.takeDamage(player.attack);
          thisEnemy.XPos -= 20;
        }
        if(thisEnemy.hp <= 0){
          var currentx = thisEnemy.XPos/30;
          var currenty = thisEnemy.YPos/30;
          if(thisEnemy.specialItem){
            switch(thisEnemy.specialItem){
              case "key":
              thisLevel.GameObjects.collectables.push(new Key({col:currentx,row:currenty}));
              drawItems(thisLevel.GameObjects.collectables);
              break;
            }
          }    
          else if(randomNumBetween(3) === 1){
            thisLevel.GameObjects.collectables.push(dropItem(thisEnemy));
            drawItems(thisLevel.GameObjects.collectables);
          }
          removeFromArray(thisLevel.GameObjects.enemies,thisEnemy);
        }
      }
    }

    //action button
    if(actionPressed){
      for(var chest in thisLevel.GameObjects.chests){
        var thisChest = thisLevel.GameObjects.chests[chest];
        if(thisChest.empty === false){
          //up action
          if(player.direction === "up" && 
            player.YPos <= thisChest.YPos + 50 && 
            player.YPos > thisChest.YPos && 
            player.XPos <= thisChest.XPos + 15 && 
            player.XPos >= thisChest.XPos - 15 ){
            chestOpen(thisChest, player, keys);
            drawItems(thisLevel.GameObjects.collectables);
          }
          //down action
          if(player.direction === "down" && 
            player.YPos >= thisChest.YPos - 50 && 
            player.YPos < thisChest.YPos && 
            player.XPos <= thisChest.XPos + 15 && 
            player.XPos >= thisChest.XPos - 15 ){
            chestOpen(thisChest, player, keys);
            drawItems(thisLevel.GameObjects.collectables);
          }
          //right action
          if(player.direction === "right" && 
            player.XPos >= thisChest.YPos - 50 && 
            player.XPos < thisChest.XPos && 
            player.YPos <= thisChest.YPos + 15 && 
            player.YPos >= thisChest.YPos - 15 ){
            chestOpen(thisChest, player, keys);
            drawItems(thisLevel.GameObjects.collectables);
          }
          //left action
          if(player.direction === "left" && 
            player.XPos <= thisChest.YPos + 50 && 
            player.XPos > thisChest.XPos && 
            player.YPos <= thisChest.YPos + 15 && 
            player.YPos >= thisChest.YPos - 15 ){
            chestOpen(thisChest, player, keys);
            drawItems(thisLevel.GameObjects.collectables);
          }
        }  
      }
      for(npc in thisLevel.GameObjects.npcs){
        thisnpc = thisLevel.GameObjects.npcs[npc];
        action(thisnpc,player,player.XPos,player.YPos);
        drawItems(thisLevel.GameObjects.collectables);
      }
      for(var pond in thisLevel.ponds){
        var thisPond = thisLevel.ponds[pond];
        action(thisPond,player,player.XPos,player.YPos);
      }
      actionPressed = false;
    }

    for(var door in thisLevel.GameObjects.doors){
      var currentLevel = thisLevel;
      var thisDoor     = currentLevel.GameObjects.doors[door];
      var thisArea     = currentLevel.GameObjects.doors[door].dest;

      if(playerCollided(thisDoor,player.XPos,player.YPos, 4)){
        thisLevel  = levels[thisArea];
        player.col = thisDoor.destX;
        player.row = thisDoor.destY;
        reRender();
      }
    }

    renderLevel();

    if(backgroundRender === false){
      renderBackground();
      backgroundRender = true;
    }

    if(runAnimation.value === true){
      requestAnimFrame(function() {
        updateGame();
      });
    }
  }

  updateGame();

}) ();
