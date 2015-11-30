(function() {
  
  var thisLevel = loadLevel(level1);
  var port = document.getElementById('viewport');
  var leftScroll = document.getElementById('viewport').scrollLeft;
  var scrollTop = document.getElementById('viewport').scrollTop;
  var canvas = document.getElementById('canvas');
  var canvas2 = document.getElementById('animation');
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
  var movementSpeed = 5;
  var frameCount = 0;
  var pace = 0;
  // var thisLevel.enemies = thisLevel.thisLevel.enemies;
  // var thisLevel.collectables = thisLevel.thisLevel.collectables;
  // var thisLevel.chests = thisLevel.thisLevel.chests;
  // var thisLevel.secrets = thisLevel.thisLevel.secrets;
  var inventory = [];
  var bank = 0;
  var tick = 0;

  
  var player = {
    "name" : "Player",
    "lives" : 3,
    "maxLives" : 3,
    "jumping" : false,
    "maxSpeed" : 3,
    "row" : thisLevel.playerRow,
    "col" : thisLevel.playerCol,
    "xspeed" : 0,
    "yspeed" : 0,
    "attack" : 1,
    "direction" : "up",
    "recovering" : false,
    "attacking" : false,
    "equiped" : "sword",
    "keys" : [],
    "animate": true
  }
  console.log(thisLevel.playerCol);



  //positioning and sizing
  var playerYPos = player.row*tileSize;
  var playerXPos = player.col*=tileSize;

  for(enemy in thisLevel.enemies){
    var enemyYPos = thisLevel.enemies[enemy].row*tileSize;
    var enemyXPos = thisLevel.enemies[enemy].col*=tileSize;
  }

  canvas.width = tileSize*thisLevel.cols;
  canvas.height = tileSize*thisLevel.rows;
  canvas2.width = tileSize*thisLevel.cols;
  canvas2.height = tileSize*thisLevel.rows;

  port.scrollTop = 1050;

  //Key mapping
  document.addEventListener('keydown', function(e){
    console.log(e.keyCode);
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
      case 32:
        player.jumping = true;
        break;
      case 16:
        if(tick < 10){
          player.attacking = true;
        }
        break;
      case 13:
        
        break;        
      case 191:
        
        if(textDisplay.value){
          actionPressed = false;
          clearTextBox();
          updateGame();
        }
        else{
          actionPressed = true;6
        }
        break;  
    }
  }, false);

  document.addEventListener('keyup', function(e){
    switch(e.keyCode){
      case 65:
        leftPressed = false;
        break
      case 87:
        upPressed = false;
        break;
      case 68:
        rightPressed = false;
        break
      case 83:
        downPressed = false;
        break
      case 32:
        player.jumping = false;
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
    context2.clearRect(0,0, canvas2.width, canvas2.height);

    //water
    waterImg.onload = function(){
      for(i=0;i<thisLevel.rows;i++){
        for(j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==3){
            context2.drawImage(waterImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    }

    //walls
    greenHillImg.onload = function(){
      for(i=0;i<thisLevel.rows;i++){
        for(j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==1){
            context2.drawImage(greenHillImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    }

    //rockyTops
    hillTopImg.onload = function(){
      for(i=0;i<thisLevel.rows;i++){
        for(j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==2){
            context2.drawImage(hillTopImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    }

    //dirt
    dirtImg.onload = function(){
      for(i=0;i<thisLevel.rows;i++){
        for(j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==0){
            context2.drawImage(dirtImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    }  
  }

  function reRender(){
    context2.clearRect(0,0, canvas2.width, canvas2.height);

    //water
      for(i=0;i<thisLevel.rows;i++){
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
    

    //rockyTops
      for(i=0;i<thisLevel.rows;i++){
        for(j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==2){
            context2.drawImage(hillTopImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    

    //dirt
      for(i=0;i<thisLevel.rows;i++){
        for(j=0;j<thisLevel.cols;j++){
          if(thisLevel.map[i][j]==0){
            context2.drawImage(dirtImg,0,0,30,30,j*tileSize,i*tileSize,tileSize,tileSize);
          }
        }
      }
    
  
  }

  function renderLevel(){

    context.clearRect(0,0, canvas.width, canvas.height);

    //enemy1
    context.fillStyle = '#ff3333';
    for(enemy in thisLevel.enemies){
      if(thisLevel.enemies[enemy].hp>0){
        context.drawImage(monsterImg,0,0,30,30,thisLevel.enemies[enemy].XPos,thisLevel.enemies[enemy].YPos,30,30);
      }
    } 

    //player
    if(player.animate){
      if(player.direction == "up"){
        context.drawImage(playerRunUp,runUpFrame.x,runUpFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction == "down"){
        context.drawImage(playerRunDown,runDownFrame.x,runDownFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction == "right"){
        context.drawImage(playerRunRight,runRightFrame.x,runRightFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
      if(player.direction == "left"){
        context.drawImage(playerRunLeft,runLeftFrame.x,runLeftFrame.y,30,30,playerXPos,playerYPos,30,30); 
      }
    }

    //items
    for(item in thisLevel.collectables){
      if(thisLevel.collectables[item].available){
        context.drawImage(thisLevel.collectables[item].img,0,0,30,30,thisLevel.collectables[item].XPos,thisLevel.collectables[item].YPos,30,30);
      }
    }

    //thisLevel.chests
    for(chest in thisLevel.chests){
      if(thisLevel.chests[chest].available){
        context.drawImage(thisLevel.chests[chest].img,0,0,30,30,thisLevel.chests[chest].XPos,thisLevel.chests[chest].YPos,30,30);
      }
    }

    //thisLevel.secrets
    for(door in thisLevel.secrets){
      if(thisLevel.secrets[door].available){
        context.drawImage(thisLevel.secrets[door].img,0,0,30,30,thisLevel.secrets[door].XPos,thisLevel.secrets[door].YPos,30,30);
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
    if(rightPressed && player.attacking == false){
      player.xspeed=player.maxSpeed;
      if(runRightFrame.x < 61){
        if(frameCount%10 == 0){
          runRightFrame.x += 30;
        }
      }
      if(runRightFrame.x>60){
        runRightFrame.x = 0;
      }
    }
    else{
      if(leftPressed && player.attacking == false){
        player.xspeed=-player.maxSpeed;
        if(runLeftFrame.x < 61){
          if(frameCount%10 == 0){
            runLeftFrame.x += 30;
          }
        }
        if(runLeftFrame.x>60){
          runLeftFrame.x = 0;
        }
      }
      else{
        if(upPressed && player.attacking == false){
          player.yspeed=-player.maxSpeed;
          if(runUpFrame.x < 61){
            if(frameCount%10 == 0){
              runUpFrame.x += 30;
            }
          }
          if(runUpFrame.x>60){
            runUpFrame.x = 30;
          }
        }
        else{
          if(downPressed && player.attacking == false){
            player.yspeed=player.maxSpeed;
            if(runDownFrame.x < 61){
              if(frameCount%10 == 0){
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

    //enemy pacing
    // horizontal pace
    
    for(enemy in thisLevel.enemies){
      if(pace < 200){
        thisLevel.enemies[enemy].xspeed = -1;
        pace++;
      }
      else if(pace >= 200 && pace < 400){
        thisLevel.enemies[enemy].xspeed = 1;
        pace++
      }
      else if(pace == 400){
        pace = 0;
      }
    } 

    playerXPos+=player.xspeed;
    playerYPos+=player.yspeed;

    for(enemy in thisLevel.enemies){
      thisLevel.enemies[enemy].XPos+=thisLevel.enemies[enemy].xspeed;
      thisLevel.enemies[enemy].YPos+=thisLevel.enemies[enemy].yspeed;
    }

    //scrolling
    if(playerXPos>(leftScroll+750)){
      port.scrollLeft+=7;
      leftScroll+=7;
    }
    else{
      if(playerXPos<(leftScroll+50)){
        port.scrollLeft-=7;
        leftScroll-=7;
      }
    }

    if(playerYPos>port.scrollTop+450){
      port.scrollTop+=7;
    }

    else{
      if(playerYPos<port.scrollTop+20){
        port.scrollTop-=7;
      }
    }

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

    //object collision
    for(chest in thisLevel.chests){
      var thisChest = thisLevel.chests[chest];
      if(playerCollided(thisChest,playerXPos,playerYPos)){
        console.log("hit chest");
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

    //enemy collision
    //Horzontal collision
    for(enemy in thisLevel.enemies){
      thisEnemy = thisLevel.enemies[enemy];
      baseCol = Math.floor(enemyXPos/tileSize);
      baseRow = Math.floor(enemyYPos/tileSize);
      colOverlap = enemyXPos%tileSize;
      rowOverlap = enemyYPos%tileSize;
  
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
    for(item in thisLevel.collectables){
      if(thisLevel.collectables[item].available && playerCollided(thisLevel.collectables[item],playerXPos,playerYPos)){
        thisLevel.collectables[item].available = false;
        switch(thisLevel.collectables[item].type){
          case "heart":
            addLife(player,thisLevel.collectables[item].qty);
            break; 
          case "key":
            player.keys.push(thisLevel.collectables[item]);
            updateKeys(player);
            console.log(keys);
            break;
          case "money":
            bank = updateBank(bank, thisLevel.collectables[item].qty);
        }
        if(thisLevel.collectables[item].name == 'end'){
          thisLevel = loadLevel(level2);
          reRender();
          playerXPos = thisLevel.playerCol*tileSize;
          playerYPos = thisLevel.playerRow*tileSize;
          // console.log(thisLevel.areas.area1)
        } 
      }
    }  

    //damage
    for(enemy in thisLevel.enemies){  
      if(playerCollided(thisLevel.enemies[enemy],playerXPos,playerYPos) && player.recovering === false){
        //take damage
        loseLife(player,thisLevel.enemies[enemy]);
        player.recovering = true;

        //bump backward
        if(player.xspeed < 0 || thisLevel.enemies[enemy].xspeed > 0 && player.yspeed == 0){
          playerXPos +=80;
        }
        else if(player.xspeed > 0 || thisLevel.enemies[enemy].xspeed < 0 && player.yspeed == 0){
          playerXPos -=80;
        }
        else if(player.yspeed > 0 || thisLevel.enemies[enemy].yspeed < 0){
          playerYPos -=80;
        }
        else if(player.yspeed < 0 || thisLevel.enemies[enemy].yspeed > 0){
          playerYPos +=80;
        }
        // console.log(player.xspeed)
        // console.log(thisLevel.enemies[enemy].xspeed)
      }
    } 

    if(player.recovering == true){
      recoverCount += 1;
      animationFlash(player,frameCount);
      if(recoverCount == 60){
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
      // console.log(player.direction);
      for(enemy in thisLevel.enemies){
        var thisEnemy = thisLevel.enemies[enemy];
        // console.log("y%="+ (playerYPos) +"enemy" + (thisEnemy.YPos));
        // console.log("x%="+ (playerXPos) + " " + (thisEnemy.XPos));
        //up attack
        if(player.direction == "up" && playerYPos - 53 <= thisEnemy.YPos && playerYPos > thisEnemy.YPos && playerXPos + 29 >= thisEnemy.XPos && playerXPos - 29 <= thisEnemy.XPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.YPos -= 20;
        }
        //down attack
        if(player.direction == "down" && playerYPos + 53 > thisEnemy.YPos  && playerYPos < thisEnemy.YPos && playerXPos + 29 >= thisEnemy.XPos && playerXPos - 29 <= thisEnemy.XPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.YPos += 20;
        }
        // //right attack
        if(player.direction == "right" && playerXPos + 53 >= thisEnemy.XPos && playerXPos < thisEnemy.XPos && playerYPos + 29 >= thisEnemy.YPos && playerYPos - 29 <= thisEnemy.YPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.XPos += 20;
        }
        // //left attack
        if(player.direction == "left" && playerXPos - 53 <= thisEnemy.XPos && playerXPos > thisEnemy.XPos && playerYPos + 29 >= thisEnemy.YPos && playerYPos - 29 <= thisEnemy.YPos ){
          thisEnemy.hp -= player.attack;
          thisEnemy.XPos -= 20;
        }
        if(thisEnemy.hp <= 0){
          console.log(thisEnemy.specialItem);
          var currentx = thisEnemy.XPos/30;
          var currenty = thisEnemy.YPos/30;
          if(thisEnemy.specialItem){
            console.log('special')
              switch(thisEnemy.specialItem){
                case "key":
                thisLevel.collectables.push(new Collectable('key',1,keyImg,true,currentx,currenty))
                break
              }
          }    
          else if(randomNumBetween(3) == 1){
            thisLevel.collectables.push(dropItem(thisEnemy))
          }
          removeFromArray(thisLevel.enemies,thisEnemy)
        }
      }
    }

    //action button
    if(actionPressed){
      for(chest in thisLevel.chests){
        var thisChest = thisLevel.chests[chest];
        if(thisChest.empty == false){
          //up action
          if(player.direction == "up" && playerYPos <= thisChest.YPos + 50 && playerYPos > thisChest.YPos && playerXPos <= thisChest.XPos + 15 && playerXPos >= thisChest.XPos - 15 ){
            chestOpen(thisChest, player, keys);  
          }
          //down action
          if(player.direction == "down" && playerYPos >= thisChest.YPos - 50 && playerYPos < thisChest.YPos && playerXPos <= thisChest.XPos + 15 && playerXPos >= thisChest.XPos - 15 ){
            chestOpen(thisChest, player, keys);
          }
          // //right action
          if(player.direction == "right" && playerXPos >= thisChest.YPos - 50 && playerXPos < thisChest.XPos && playerYPos <= thisChest.YPos + 15 && playerYPos >= thisChest.YPos - 15 ){
            chestOpen(thisChest, player, keys);
          }
          // //left action
          if(player.direction == "left" && playerXPos <= thisChest.YPos + 50 && playerXPos > thisChest.XPos && playerYPos <= thisChest.YPos + 15 && playerYPos >= thisChest.YPos - 15 ){
            chestOpen(thisChest, player, keys);
          }
        }  
      }
      for(secret in thisLevel.secrets){
        var thisSecret = thisLevel.secrets[secret];
        action(thisSecret,player,playerXPos,playerYPos);
      }
      actionPressed = false;
    }

    for(secret in thisLevel.secrets){
      var currentLevel = thisLevel;
      var thisArea = thisLevel.secrets[secret].name;
      if(playerYPos == thisLevel.secrets[secret].YPos && playerXPos == thisLevel.secrets[secret].XPos){
        thisLevel = loadLevel(currentLevel.areas[thisArea]);
        playerXPos = currentLevel.areas[thisArea].playerCol*tileSize;
        playerYPos = currentLevel.areas[thisArea].playerRow*tileSize;
        console.log(thisLevel)
        reRender();
      }
    }

    renderLevel();
    if(backgroundRender == false){
      renderBackground();
      backgroundRender = true;
    }

    if(runAnimation.value == true){
      requestAnimFrame(function() {
        updateGame();
      });
    }
  }
  console.log(renderBackground)

  updateGame();
  // renderBackground();

}) ();
