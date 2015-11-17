(function() {
  var port = document.getElementById('viewport');
  var leftScroll = document.getElementById('viewport').scrollLeft;
  var scrollTop = document.getElementById('viewport').scrollTop;
  var canvas = document.getElementById('canvas');
  var lives = document.getElementById('lives');
  var playerInfo = document.getElementById('playerInfo');
  var context = canvas.getContext('2d');
  var runAnimation = {
    "value": true
  }
  var recoverCount = 0;
  var levelCols = 300;
  var levelRows = 35;
  var tileSize = 30;
  var leftPressed = false;
  var rightPressed = false;
  var upPressed = false;
  var downPressed = false;
  var actionPressed = false;
  var movementSpeed = 5;
  var imageObj = new Image();
  var frameCount = 0;
  var pace = 0;
  var enemies = [];
  var collectables = [];
  var chests = [];
  var inventory = [];
  var bank = 0;
  var dirtBuilt = false;
  var tick = 0;


  var player = {
    "name" : "Player",
    "lives" : 3,
    "maxLives" : 3,
    "jumping" : false,
    "maxSpeed" : 3,
    "row" : 31,
    "col" : 5,
    "xspeed" : 0,
    "yspeed" : 0,
    "attack" : 1,
    "direction" : "up",
    "recovering" : false,
    "attacking" : false,
    "keys" : [],
    "animate": true
  }

  //set up enemies

  

  var enemy = new Enemy(enemies,'enemy1',10,28,3,3,2,'key');
  var enemy = new Enemy(enemies,'enemy2',12,12,3,3,2);
  console.log(enemies); 
  console.log(player);

  var heartcontainer = new Collectable(collectables,'heart',2, heartImg,true,12,13);
  var key = new Collectable(collectables,'key',1,keyImg,true,15,15,'key');
  var jewel = new Collectable(collectables,'money',1,jewelImg,true,10,20);
  var jewel = new Collectable(collectables,'money',1,jewelImg,true,12,20);
  console.log(player.keys.length + "key");

  //chests

  var lootChest = new Chest(chests,chestImg,10,18,true,function(){
    new Collectable(collectables,'heart',2, heartImg,true,12,18);
  });
  console.log(lootChest);

  //positioning and sizing
  var playerYPos = player.row*tileSize;
  var playerXPos = player.col*=tileSize;

  var enemyYPos = enemy.row*tileSize;
  var enemyXPos = enemy.col*=tileSize;

  canvas.width = tileSize*levelCols;
  canvas.height = tileSize*levelRows;

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
      case 191:
        actionPressed = true;
        clearTextBox();
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
  function renderLevel(){
    //walls
    context.clearRect(0,0, canvas.width, canvas.height);
    context.fillStyle = '#dd9b46';
    for(i=0;i<levelRows;i++){
      for(j=0;j<levelCols;j++){
        if(level[i][j]==1){
          context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //dirt
    context.fillStyle = '#f3d692';
    for(i=0;i<levelRows;i++){
      for(j=0;j<levelCols;j++){
        if(level[i][j]==0){
          context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //water
    context.fillStyle = '#99e7ff';
    for(i=0;i<levelRows;i++){
      for(j=0;j<levelCols;j++){
        if(level[i][j]==2){
          context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //enemy1
    context.fillStyle = '#ff3333';
    for(enemy in enemies){
      if(enemies[enemy].hp>0){
        context.drawImage(monsterImg,0,0,30,30,enemies[enemy].XPos,enemies[enemy].YPos,30,30);
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
    for(item in collectables){
      if(collectables[item].available){
        context.drawImage(collectables[item].img,0,0,30,30,collectables[item].XPos,collectables[item].YPos,30,30);
      }
    }

    //chests
    for(chest in chests){
      if(chests[chest].available){
        context.drawImage(chests[chest].img,0,0,30,30,chests[chest].XPos,chests[chest].YPos,30,30);
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
    if(rightPressed){
      player.xspeed=player.maxSpeed;
      if(runRightFrame.x < 61){
            if(frameCount%10 == 0){
              runRightFrame.x += 30;
              // console.log("frameCount"+frameCount)
            }
          }
          if(runRightFrame.x>60){
            runRightFrame.x = 0;
          }
    }
    else{
      if(leftPressed){
        player.xspeed=-player.maxSpeed;
        if(runLeftFrame.x < 61){
            if(frameCount%10 == 0){
              runLeftFrame.x += 30;
              // console.log("frameCount"+frameCount)
            }
          }
          if(runLeftFrame.x>60){
            runLeftFrame.x = 0;
          }
      }
      else{
        if(upPressed){
          player.yspeed=-player.maxSpeed;
          if(runUpFrame.x < 61){
            if(frameCount%10 == 0){
              runUpFrame.x += 30;
              // console.log("frameCount"+frameCount)
            }
          }
          if(runUpFrame.x>60){
            runUpFrame.x = 30;
          }
        }
        else{
          if(downPressed){
            player.yspeed=player.maxSpeed;
            if(runDownFrame.x < 61){
            if(frameCount%10 == 0){
              runDownFrame.x += 30;
              // console.log("frameCount"+frameCount)
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
    
    for(enemy in enemies){
      if(pace < 200){
        enemies[enemy].xspeed = -1;
        pace++;
      }
      else if(pace >= 200 && pace < 400){
        enemies[enemy].xspeed = 1;
        pace++
      }
      else if(pace == 400){
        pace = 0;
      }
    } 

    playerXPos+=player.xspeed;
    playerYPos+=player.yspeed;

    for(enemy in enemies){
      enemies[enemy].XPos+=enemies[enemy].xspeed;
      enemies[enemy].YPos+=enemies[enemy].yspeed;
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
      //Do stuff
      port.scrollTop+=7;

    }
    else{
      if(playerYPos<port.scrollTop+20){
        //do other stuff
        port.scrollTop-=7;
      }
    }

    var baseCol = Math.floor(playerXPos/tileSize);
    var baseRow = Math.floor(playerYPos/tileSize);
    var colOverlap = playerXPos%tileSize;
    var rowOverlap = playerYPos%tileSize;

    //Horzontal collision
    if(player.xspeed>0){
      if((level[baseRow][baseCol+1] && !level[baseRow][baseCol]) ||
         (level[baseRow+1][baseCol+1] && !level[baseRow+1][baseCol] && rowOverlap)){
        playerXPos=baseCol*tileSize;
      }
    }

    if(player.xspeed<0){
      if((!level[baseRow][baseCol+1] && level[baseRow][baseCol]) ||
         (!level[baseRow+1][baseCol+1] && level[baseRow+1][baseCol] && rowOverlap)){
        playerXPos=(baseCol+1)*tileSize;
      }
    }

    //Vertical collision
    if(player.yspeed>0){
      if((level[baseRow+1][baseCol] && !level[baseRow][baseCol]) ||
         (level[baseRow+1][baseCol+1] && !level[baseRow][baseCol+1] && colOverlap)){
        playerYPos = baseRow*tileSize;
      }
    }

    if(player.yspeed<0){
      if((!level[baseRow+1][baseCol] && level[baseRow][baseCol]) ||
         (!level[baseRow+1][baseCol+1] && level[baseRow][baseCol+1] && rowOverlap)){
        playerYPos=(baseRow+1)*tileSize;
      }
    }

    //object collision
    for(chest in chests){
      var thisChest = chests[chest];
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

    baseCol = Math.floor(enemyXPos/tileSize);
    baseRow = Math.floor(enemyYPos/tileSize);
    colOverlap = enemyXPos%tileSize;
    rowOverlap = enemyYPos%tileSize;

    if(enemy.xspeed>0){
      if((level[baseRow][baseCol+1] && !level[baseRow][baseCol]) ||
         (level[baseRow+1][baseCol+1] && !level[baseRow+1][baseCol] && rowOverlap)){
        enemyXPos=baseCol*tileSize;
      }
    }

    if(enemy.xspeed<0){
      if((!level[baseRow][baseCol+1] && level[baseRow][baseCol]) ||
         (!level[baseRow+1][baseCol+1] && level[baseRow+1][baseCol] && rowOverlap)){
        enemyXPos=(baseCol+1)*tileSize;
      }
    }

    //Vertical collision
    if(enemy.yspeed>0){
      if((level[baseRow+1][baseCol] && !level[baseRow][baseCol]) ||
        (level[baseRow+1][baseCol+1] && !level[baseRow][baseCol+1] && colOverlap)){
        enemyYPos = baseRow*tileSize;
      }
    }

    if(enemy.yspeed<0){
      if((!level[baseRow+1][baseCol] && level[baseRow][baseCol]) ||
        (!level[baseRow+1][baseCol+1] && level[baseRow][baseCol+1] && rowOverlap)){
        enemyYPos=(baseRow+1)*tileSize;
      }
    }

    //item pick up
    for(item in collectables){
      if(collectables[item].available && playerCollided(collectables[item],playerXPos,playerYPos)){
        collectables[item].available = false;
        switch(collectables[item].type){
          case "heart":
            addLife(player,collectables[item].qty);
            break; 
          case "key":
            inventory.push(collectables[item]);
            player.keys.push(collectables[item]);
            inventory = updateInventory(inventory);
            break;
          case "money":
            bank = updateBank(bank, collectables[item].qty);
        }
      }
    }  

    //damage
    for(enemy in enemies){  
      if(playerCollided(enemies[enemy],playerXPos,playerYPos) && player.recovering === false){
        //take damage
        loseLife(player,enemies[enemy]);
        player.recovering = true;

        //bump backward
        if(player.xspeed < 0 || enemies[enemy].xspeed > 0 && player.yspeed == 0){
          playerXPos +=80;
        }
        else if(player.xspeed > 0 || enemies[enemy].xspeed < 0 && player.yspeed == 0){
          playerXPos -=80;
        }
        else if(player.yspeed > 0 || enemies[enemy].yspeed < 0){
          playerYPos -=80;
        }
        else if(player.yspeed < 0 || enemies[enemy].yspeed > 0){
          playerYPos +=80;
        }
        // console.log(player.xspeed)
        // console.log(enemies[enemy].xspeed)
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
        } 
    //attack
      if(player.attacking && tick > 2 && tick < 4){
        // console.log(player.direction);
        for(enemy in enemies){
          var thisEnemy = enemies[enemy];
          // console.log("y%="+ (playerYPos) +"enemy" + (thisEnemy.YPos));
          // console.log("x%="+ (playerXPos) + " " + (thisEnemy.XPos));
          //up attack
          if(player.direction == "up" && playerYPos - 53 <= thisEnemy.YPos && playerXPos + 29 >= thisEnemy.XPos && playerXPos - 29 <= thisEnemy.XPos ){
            thisEnemy.hp -= player.attack;
            thisEnemy.YPos -= 20;
          }
          //down attack
          if(player.direction == "down" && playerYPos + 53 > thisEnemy.YPos  && playerXPos + 29 >= thisEnemy.XPos && playerXPos - 29 <= thisEnemy.XPos ){
            thisEnemy.hp -= player.attack;
            thisEnemy.YPos += 20;
          }
          // //right attack
          if(player.direction == "right" && playerXPos + 53 >= thisEnemy.XPos && playerYPos + 29 >= thisEnemy.YPos && playerYPos - 29 <= thisEnemy.YPos ){
            thisEnemy.hp -= player.attack;
            thisEnemy.XPos += 20;
          }
          // //left attack
          if(player.direction == "left" && playerXPos - 53 <= thisEnemy.XPos && playerYPos + 29 >= thisEnemy.YPos && playerYPos - 29 <= thisEnemy.YPos ){
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
                  new Collectable(collectables,'key',1,keyImg,true,currentx,currenty);
                  break
                }
            }    
            else if(randomNumBetween(3) == 1){
              dropItem(thisEnemy,collectables);
            }
            removeFromArray(enemies,thisEnemy)
          }
        }
      }


      //action button
      if(actionPressed){
        for(chest in chests){
          var thisChest = chests[chest];
          if(thisChest.empty == false){
            //up action
            if(player.direction == "up" && playerYPos <= thisChest.YPos + 50 && playerYPos > thisChest.YPos && playerXPos <= thisChest.XPos + 15 && playerXPos >= thisChest.XPos - 15 ){
              chestOpen(thisChest, player);  
            }
            //down action
            if(player.direction == "down" && playerYPos >= thisChest.YPos - 50 && playerYPos < thisChest.YPos && playerXPos <= thisChest.XPos + 15 && playerXPos >= thisChest.XPos - 15 ){
              thisChest.open();
              thisChest.empty = true;
            }
            // //right action
            if(player.direction == "right" && playerXPos >= thisChest.YPos - 50 && playerXPos < thisChest.XPos && playerYPos <= thisChest.YPos + 15 && playerYPos >= thisChest.YPos - 15 ){
              thisChest.open();
              thisChest.empty = true;
            }
            // //left action
            if(player.direction == "left" && playerXPos <= thisChest.YPos + 50 && playerXPos > thisChest.XPos && playerYPos <= thisChest.YPos + 15 && playerYPos >= thisChest.YPos - 15 ){
              thisChest.open();
              thisChest.empty = true;
            }
          }  
        }
      }

    renderLevel();

    if(runAnimation.value == true){
      requestAnimFrame(function() {
          updateGame();
        });
    }
  }

  updateGame();

}) ();
