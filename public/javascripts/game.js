(function() {
  
  var gameApi = require('./components/gameApi');
  var assets = require('./components/assets');
  var levels = require('./components/levels');
  var player = require('./components/player.js');
  var thisLevel = levels.level1;
  var thisBackground = document.getElementById('background');
  var port = document.getElementById('viewport');
  var leftScroll = document.getElementById('viewport').scrollLeft;
  var scrollTop = document.getElementById('viewport').scrollTop;
  var canvas = document.getElementById('canvas');
  var canvas2 = document.getElementById('animation');
  var gameState = { 'value':'play' };
  var lives = document.getElementById('lives');
  var playerInfo = document.getElementById('playerInfo');
  var context = canvas.getContext('2d');
  var context2 = canvas2.getContext('2d');
  var backgroundRender = false;
  var recoverCount = 0;
  var tileSize = 30;
  var leftPressed = false;
  var rightPressed = false;
  var upPressed = false;
  var downPressed = false;
  var actionPressed = false;
  var frameCount = 0;
  var pace = 0;
  var inventory = [];
  var bank = 0;
  var tick = 0;
  var playerYPos;
  var playerXPos

  //positioning and sizing
  player.row = thisLevel.playerRow;
  player.col = thisLevel.playerCol;
  playerYPos = player.row*tileSize;
  playerXPos = player.col*tileSize;


  for(var enemy in thisLevel.enemies){
    thisLevel.enemies[enemy].XPos = thisLevel.enemies[enemy].col*tileSize;
    thisLevel.enemies[enemy].YPos = thisLevel.enemies[enemy].row*tileSize;
  }

  for(var npc in thisLevel.npcs){
    thisLevel.npcs[npc].XPos = thisLevel.npcs[npc].col*tileSize;
    thisLevel.npcs[npc].YPos = thisLevel.npcs[npc].row*tileSize;
  }

  for(var door in thisLevel.doors){
    thisLevel.doors[door].XPos = thisLevel.doors[door].col*tileSize;
    thisLevel.doors[door].YPos = thisLevel.doors[door].row*tileSize;
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
    canvas.width   = tileSize*thisLevel.cols;
    canvas.height  = tileSize*thisLevel.rows;
    canvas2.width  = tileSize*thisLevel.cols;
    canvas2.height = tileSize*thisLevel.rows;
    port.scrollTop = playerYPos;
    port.scrollLeft = playerXPos-500;
    updateInventory(player.inventory);
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
    canvas.width   = tileSize*thisLevel.cols;
    canvas.height  = tileSize*thisLevel.rows;
    canvas2.width  = tileSize*thisLevel.cols;
    canvas2.height = tileSize*thisLevel.rows;
    context2.clearRect(0,0, canvas2.width, canvas2.height);
    playerYPos = player.row*tileSize;
    playerXPos = player.col*tileSize;
    port.scrollTop = playerYPos;
    port.scrollLeft = playerXPos-500;

    

    for(var enemy in thisLevel.enemies){
      thisLevel.enemies[enemy].XPos = thisLevel.enemies[enemy].col*tileSize;
      thisLevel.enemies[enemy].YPos = thisLevel.enemies[enemy].row*tileSize;
    }

    for(var npc in thisLevel.npcs){
      thisLevel.npcs[npc].XPos = thisLevel.npcs[npc].col*tileSize;
      thisLevel.npcs[npc].YPos = thisLevel.npcs[npc].row*tileSize;
    }

    for(var door in thisLevel.doors){
      thisLevel.doors[door].XPos = thisLevel.doors[door].col*tileSize;
      thisLevel.doors[door].YPos = thisLevel.doors[door].row*tileSize;
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

    //enemy1
    for(var enemy in thisLevel.enemies){
      if(thisLevel.enemies[enemy].hp>0){
        context.drawImage(thisLevel.enemies[enemy].img,0,0,30,30,thisLevel.enemies[enemy].XPos,thisLevel.enemies[enemy].YPos,30,30);
      }
    } 

    //npc
    for(var person in thisLevel.npcs){
      var thisNpc = thisLevel.npcs[person];
      if(thisLevel.npcs[person].available){
        context.drawImage(thisNpc.img,0,0,thisNpc.width,thisNpc.height,thisNpc.XPos,thisNpc.YPos,thisNpc.width,thisNpc.height);
      }
    } 


    for(var collectable in thisLevel.collectables){
      thisLevel.collectables[collectable].XPos = thisLevel.collectables[collectable].col*tileSize;
      thisLevel.collectables[collectable].YPos = thisLevel.collectables[collectable].row*tileSize;
    }

    //player
    if(player.animate && player.attacking === false){
      if(player.direction === "up"){
        context.drawImage(playerRunUp,runUpFrame.x,runUpFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction === "down"){
        context.drawImage(playerRunDown,runDownFrame.x,runDownFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction === "right"){
        context.drawImage(playerRunRight,runRightFrame.x,runRightFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction === "left"){
        context.drawImage(playerRunLeft,runLeftFrame.x,runLeftFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
    }
    else if(player.attacking || player.fishing){
      if(player.direction === "up"){
        context.drawImage(attackMove,0,0,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction === "down"){
        context.drawImage(attackMove,60,0,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction === "right"){
        context.drawImage(attackMove,30,0,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction === "left"){
        context.drawImage(attackMove,90,0,30,30,playerXPos,playerYPos,30,30); 
      }
    }

    //items
    for(var item in thisLevel.collectables){
      if(thisLevel.collectables[item].available){
        context.drawImage(thisLevel.collectables[item].img,0,0,30,30,thisLevel.collectables[item].XPos,thisLevel.collectables[item].YPos,30,30);
      }
    }

    //thisLevel.chests
    for(var chest in thisLevel.chests){
      if(thisLevel.chests[chest].available){
        context.drawImage(thisLevel.chests[chest].img,0,0,30,30,thisLevel.chests[chest].XPos,thisLevel.chests[chest].YPos,30,30);
      }
    }

    if(player.attacking){
      if(tick < 10){
        switch(player.direction){
          case "up":
            context.drawImage(playerAttack,attackFrame.x,attackFrame.y,30,30,playerXPos,playerYPos-30,30,30);
            tick += 1;
            break;
          case "right":
            context.drawImage(playerAttack,attackFrame.x+30,attackFrame.y,30,30,playerXPos+30,playerYPos,30,30);
            tick += 1;
            break;
          case "down":
            context.drawImage(playerAttack,attackFrame.x+60,attackFrame.y,30,30,playerXPos,playerYPos+30,30,30);
            tick += 1; 
            break;
          case "left":
            context.drawImage(playerAttack,attackFrame.x+90,attackFrame.y,30,30,playerXPos-30,playerYPos,30,30);
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
          context.drawImage(playerAttack,attackFrame.x,attackFrame.y,30,30,playerXPos,playerYPos-30,30,30);
          break;
        case "right":
          context.drawImage(playerAttack,attackFrame.x+30,attackFrame.y,30,30,playerXPos+30,playerYPos,30,30);
          break;
        case "down":
          context.drawImage(playerAttack,attackFrame.x+60,attackFrame.y,30,30,playerXPos,playerYPos+30,30,30);
          break;
        case "left":
          context.drawImage(playerAttack,attackFrame.x+90,attackFrame.y,30,30,playerXPos-30,playerYPos,30,30);
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

    playerXPos+=player.xspeed;
    playerYPos+=player.yspeed;

    //scrolling
    port.scrollTop = playerYPos-250;
    port.scrollLeft = playerXPos-450;

    //enemy pacing
    for(var enemy in thisLevel.enemies){
      var speed = thisLevel.enemies[enemy].maxSpeed;
      var random = randomNumBetween(4);
      var thisEnemy = thisLevel.enemies[enemy];
      if(pace >= 100 && pace < 110){
        thisEnemy.xspeed = 0;
        thisEnemy.yspeed = 0;
      }
     if(pace === 220){
        thisEnemy.xspeed = 0;
        thisEnemy.yspeed = 0;
        pace = 0;
      }
      if(pace === 10){
        thisEnemy.xspeed = 0;
        thisEnemy.yspeed = 0;
        switch(random){
          case 1:
            thisEnemy.xspeed = -(speed);
            break;
          case 2:
            thisEnemy.xspeed = speed;
            break;
          case 3:
            thisEnemy.yspeed = -(speed);
            break;
          case 4:
            thisEnemy.yspeed = speed;
            break;      
        }
      }
      else if(pace === 110){
        thisEnemy.xspeed = 0;
        thisEnemy.yspeed = 0;
        switch(random){
          case 1:
            thisEnemy.xspeed = -(speed);
            break;
          case 2:
            thisEnemy.xspeed = speed;
            break;
          case 3:
            thisEnemy.yspeed = -(speed);
            break;
          case 4:
            thisEnemy.yspeed = speed;
            break;      
        }
      }
    } 

    pace++;

    for(enemy in thisLevel.enemies){
      var thisEnemy = thisLevel.enemies[enemy];
      thisEnemy.XPos+=thisEnemy.xspeed;
      thisEnemy.YPos+=thisEnemy.yspeed;
    }

    (function playerCollision() {
      var baseCol = Math.floor(playerXPos/tileSize);
      var baseRow = Math.floor(playerYPos/tileSize);
      var colOverlap = playerXPos%tileSize;
      var rowOverlap = playerYPos%tileSize;

      //Horzontal collision
      if(player.xspeed>0){
        if((thisLevel.map[baseRow][baseCol+1]>0 && !thisLevel.map[baseRow][baseCol]) ||
           (thisLevel.map[baseRow+1][baseCol+1]>0 && !thisLevel.map[baseRow+1][baseCol] && rowOverlap)){
          playerXPos=baseCol*tileSize;
        }
      }

      if(player.xspeed<0){
        if((!thisLevel.map[baseRow][baseCol+1]>0 && thisLevel.map[baseRow][baseCol]) ||
           (!thisLevel.map[baseRow+1][baseCol+1]>0 && thisLevel.map[baseRow+1][baseCol] && rowOverlap)){
          playerXPos=(baseCol+1)*tileSize;
        }
      }

      //Vertical collision
      if(player.yspeed>0){
        if((thisLevel.map[baseRow+1][baseCol]>0 && !thisLevel.map[baseRow][baseCol]) ||
           (thisLevel.map[baseRow+1][baseCol+1]>0 && !thisLevel.map[baseRow][baseCol+1] && colOverlap)){
          playerYPos = baseRow*tileSize;
        }
      }

      if(player.yspeed<0){
        if((!thisLevel.map[baseRow+1][baseCol]>0 && thisLevel.map[baseRow][baseCol]) ||
           (!thisLevel.map[baseRow+1][baseCol+1]>0 && thisLevel.map[baseRow][baseCol+1] && rowOverlap)){
          playerYPos=(baseRow+1)*tileSize;
        }
      }
    }) ();  

    //object collision
    for(var chest in thisLevel.chests){
      var thisChest = thisLevel.chests[chest];
      if(playerCollided(thisChest,playerXPos,playerYPos)){
        if(player.yspeed<0){
          playerYPos=thisChest.YPos+tileSize;
        }
        if(player.yspeed>0){
          playerYPos=thisChest.YPos-tileSize;
        }
        if(player.xspeed>0){
          playerXPos=thisChest.XPos-tileSize;
        }
        if(player.xspeed<0){
          playerXPos=thisChest.XPos+tileSize;
        }
      }    
    }

    for(var npc in thisLevel.npcs){
      var thisnpc = thisLevel.npcs[npc];
      if(playerCollided(thisnpc,playerXPos,playerYPos)){
        if(player.yspeed<0){
          playerYPos=thisnpc.YPos+tileSize;
        }
        if(player.yspeed>0){
          playerYPos=thisnpc.YPos-tileSize;
        }
        if(player.xspeed>0){
          playerXPos=thisnpc.XPos-tileSize;
        }
        if(player.xspeed<0){
          playerXPos=thisnpc.XPos+tileSize;
        }
      }    
    }
    
    //enemy collision
    //Horzontal collision

    (function enemyCollision() {
      for(enemy in thisLevel.enemies){
        var thisEnemy  = thisLevel.enemies[enemy];
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
    })  ();

    //item pick up
    for(var item in thisLevel.collectables){
      if(thisLevel.collectables[item].available && playerCollided(thisLevel.collectables[item],playerXPos,playerYPos)){
        thisLevel.collectables[item].available = false;
        switch(thisLevel.collectables[item].type){
          case "heart":
            addLife(player,thisLevel.collectables[item].qty);
            break;
          case "heartContainer":
            addLife(player,thisLevel.collectables[item].qty);
            player.maxLives += 1;
            player.lives = player.maxLives;
            textBox('"I feel stronger somehow..."');         
            break;   
          case "weapon":
            player = equip(player,thisLevel.collectables[item]);
            updateInventory(player.inventory);
            break;  
          case "key":
            player.keys.push(thisLevel.collectables[item]);
            updateKeys(player);
            break;
          case "money":
            bank = updateBank(bank, thisLevel.collectables[item].qty);
            break;
          case "relic":
            player.inventory.push(thisLevel.collectables[item]);
            updateInventory(player.inventory);
            textBox('It\'s a strange metal bar. It looks like it was meant to have some sort of function.' );
            break;
          case "fish":
            player.inventory.push(thisLevel.collectables[item]);
            updateInventory(player.inventory);
            break;
        }
        if(thisLevel.collectables[item].name === 'end'){
          thisLevel = levels.level2;
          reRender();
          playerXPos = thisLevel.playerCol*tileSize;
          playerYPos = thisLevel.playerRow*tileSize;
        } 
      }
    }  

    //damage
    for(var enemy in thisLevel.enemies){  
      if(playerCollided(thisLevel.enemies[enemy],playerXPos,playerYPos) && player.recovering === false){
        //take damage
        loseLife(player,thisLevel.enemies[enemy]);
        player.recovering = true;
        //bump backward
        if(player.xspeed < 0 || thisLevel.enemies[enemy].xspeed > 0 && player.yspeed === 0){
          playerXPos +=80;
        }
        else if(player.xspeed > 0 || thisLevel.enemies[enemy].xspeed < 0 && player.yspeed === 0){
          playerXPos -=80;
        }
        else if(player.yspeed > 0 || thisLevel.enemies[enemy].yspeed < 0){
          playerYPos -=80;
        }
        else if(player.yspeed < 0 || thisLevel.enemies[enemy].yspeed > 0){
          playerYPos +=80;
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
      for(var enemy in thisLevel.enemies){
        var thisEnemy = thisLevel.enemies[enemy];
        //up attack
        if(player.direction === "up" && 
          playerYPos - 53 <= thisEnemy.YPos && 
          playerYPos > thisEnemy.YPos && 
          playerXPos + 29 >= thisEnemy.XPos && 
          playerXPos - 29 <= thisEnemy.XPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.YPos -= 20;
        }
        //down attack
        if(player.direction === "down" && 
          playerYPos + 53 > thisEnemy.YPos  && 
          playerYPos < thisEnemy.YPos && 
          playerXPos + 29 >= thisEnemy.XPos && 
          playerXPos - 29 <= thisEnemy.XPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.YPos += 20;
        }
        // //right attack
        if(player.direction === "right" && 
          playerXPos + 53 >= thisEnemy.XPos && 
          playerXPos < thisEnemy.XPos && 
          playerYPos + 29 >= thisEnemy.YPos && 
          playerYPos - 29 <= thisEnemy.YPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.XPos += 20;
        }
        // //left attack
        if(player.direction === "left" && 
          playerXPos - 53 <= thisEnemy.XPos && 
          playerXPos > thisEnemy.XPos && 
          playerYPos + 29 >= thisEnemy.YPos && 
          playerYPos - 29 <= thisEnemy.YPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.XPos -= 20;
        }
        if(thisEnemy.hp <= 0){
          var currentx = thisEnemy.XPos/30;
          var currenty = thisEnemy.YPos/30;
          if(thisEnemy.specialItem){
            switch(thisEnemy.specialItem){
              case "key":
              thisLevel.collectables.push(new Key({col:currentx,row:currenty}));
              drawItems(thisLevel.collectables);
              break;
            }
          }    
          else if(randomNumBetween(3) === 1){
            thisLevel.collectables.push(dropItem(thisEnemy));
          }
          removeFromArray(thisLevel.enemies,thisEnemy);
        }
      }
    }

    //action button
    if(actionPressed){
      for(var chest in thisLevel.chests){
        var thisChest = thisLevel.chests[chest];
        if(thisChest.empty === false){
          //up action
          if(player.direction === "up" && 
            playerYPos <= thisChest.YPos + 50 && 
            playerYPos > thisChest.YPos && 
            playerXPos <= thisChest.XPos + 15 && 
            playerXPos >= thisChest.XPos - 15 ){
            chestOpen(thisChest, player, keys);  
          }
          //down action
          if(player.direction === "down" && 
            playerYPos >= thisChest.YPos - 50 && 
            playerYPos < thisChest.YPos && 
            playerXPos <= thisChest.XPos + 15 && 
            playerXPos >= thisChest.XPos - 15 ){
            chestOpen(thisChest, player, keys);
          }
          //right action
          if(player.direction === "right" && 
            playerXPos >= thisChest.YPos - 50 && 
            playerXPos < thisChest.XPos && 
            playerYPos <= thisChest.YPos + 15 && 
            playerYPos >= thisChest.YPos - 15 ){
            chestOpen(thisChest, player, keys);
          }
          //left action
          if(player.direction === "left" && 
            playerXPos <= thisChest.YPos + 50 && 
            playerXPos > thisChest.XPos && 
            playerYPos <= thisChest.YPos + 15 && 
            playerYPos >= thisChest.YPos - 15 ){
            chestOpen(thisChest, player, keys);
          }
        }  
      }
      for(var secret in thisLevel.secrets){
        var thisSecret = thisLevel.secrets[secret];
        action(thisSecret,player,playerXPos,playerYPos);
      }
      for(npc in thisLevel.npcs){
        thisnpc = thisLevel.npcs[npc];
        action(thisnpc,player,playerXPos,playerYPos);
      }
      for(var pond in thisLevel.ponds){
        var thisPond = thisLevel.ponds[pond];
        action(thisPond,player,playerXPos,playerYPos);
      }
      actionPressed = false;
    }

    for(var door in thisLevel.doors){
      var currentLevel = thisLevel;
      var thisDoor = currentLevel.doors[door];
      var thisArea = currentLevel.doors[door].dest;
      if(playerCollided(thisDoor,playerXPos,playerYPos, 4)){
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
