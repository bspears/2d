(function() {
  var port = document.getElementById('viewport');
  var leftScroll = document.getElementById('viewport').scrollLeft;
  var scrollTop = document.getElementById('viewport').scrollTop;
  var canvas = document.getElementById('canvas');
  var lives = document.getElementById('lives');
  var playerInfo = document.getElementById('playerInfo');
  var context = canvas.getContext('2d');
  var levelCols = 300;
  var levelRows = 26;
  var tileSize = 30;
  var leftPressed = false;
  var rightPressed = false;
  var upPressed = false;
  var downPressed = false;
  var jumpPressed = false;
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


  var player = {
    "name" : "Player",
    "lives" : 3,
    "maxLives" : 3,
    "jumping" : false,
    "maxSpeed" : 3,
    "row" : 23,
    "col" : 5,
    "xspeed" : 0,
    "yspeed" : 0,
    "attack" : 1,
    "direction" : "up",
    "recovering" : false,
    "attacking" : false
  }

  //set up enemies

  var Enemy = function Enemy(enemyType,col,row,hp,maxSpeed,attack,xpos,ypos){
    this.enemyType = enemyType;
    this.col = col;
    this.row = row;
    this.hp = hp;
    this.xspeed = 0;
    this.yspeed = 0;
    this.maxSpeed = maxSpeed;
    this.attack = attack;
    this.xpos = xpos;
    this.ypos = ypos;
    this.YPos = row*tileSize;
    this.XPos = col*=tileSize;
    enemies.push(this);
  }

  var enemy = new Enemy('enemy1',10,21,2,3,2);
  var enemy = new Enemy('enemy2',12,12,2,3,2);
  console.log(enemies); 
  console.log(player);

  //collectables

  var Collectable = function Item(type,qty,img,available,col,row,name){
    this.type = type;
    this.qty = qty;
    this.img = img;
    this.col = col;
    this.row = row;
    this.YPos = row*tileSize;
    this.XPos = col*=tileSize;
    this.available = available;
    collectables.push(this);
  }

  var heartcontainer = new Collectable('heart',2, heartImg,true,12,13);
  var key = new Collectable('object',1,keyImg,true,15,15,'key');
  var jewel = new Collectable('money',1,jewelImg,true,10,20)
  console.log(key);

  //chests

  var Chest = function Chest(img,col,row,locked,contents){
    this.img = img;
    this.col = col;
    this.row = row;
    this.locked = locked;
    this.contents = contents;
    this.available = true;
    this.col = col;
    this.row = row;
    this.YPos = row*tileSize;
    this.XPos = col*=tileSize;
    this.open = function(contents){
      
    }
    chests.push(this);
  };

  var lootChest = new Chest(chestImg,10,18,true);

  //positioning and sizing
  var playerYPos = player.row*tileSize;
  var playerXPos = player.col*=tileSize;

  var enemyYPos = enemy.row*tileSize;
  var enemyXPos = enemy.col*=tileSize;

  canvas.width = tileSize*levelCols;
  canvas.height = tileSize*levelRows;

  port.scrollTop = 750;

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
        player.attacking = true;
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
    if(player.lives>0){
      context.drawImage(playerRunUp,runUpFrame.x,runUpFrame.y,30,30,playerXPos,playerYPos,30,30);
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
    if(rightPressed){
      player.xspeed=player.maxSpeed;
    }
    else{
      if(leftPressed){
        player.xspeed=-player.maxSpeed;
      }
      else{
        if(upPressed){
          player.yspeed=-player.maxSpeed;
          if(runUpFrame.x < 61){
            if(frameCount%10 == 0){
              runUpFrame.x += 30;
              console.log("frameCount"+frameCount)
            }
          }
          if(runUpFrame.x>60){
            runUpFrame.x = 30;
          }
        }
        else{
          if(downPressed){
            player.yspeed=player.maxSpeed;
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


    // player.maxSpeed *= friction;

    // if(jumpPressed){
    //   if(!jumping && !falling && canJump){
    //     jumping = true;
    //     if(jumpHeight<maxJump){
    //       player.yspeed =- 2;
    //       jumpHeight++;
    //       console.log(jumpHeight);
    //       if(jumpHeight==maxJump){
    //         console.log('max hit');
    //         jumping = false;
    //         falling = true;
    //         canJump = false;
    //       }
    //     }
    //   }
    //   if(falling){
    //     jumpHeight--;
    //     if(jumpHeight==0){
    //       falling = false;
    //     }
    //   }
    //   jumping = false;
    // }


    playerXPos+=player.xspeed;
    playerYPos+=player.yspeed;

    for(enemy in enemies){
      enemies[enemy].XPos+=enemies[enemy].xspeed;
      enemies[enemy].YPos+=enemies[enemy].yspeed

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

    baseCol = Math.floor(playerXPos/tileSize);
    baseRow = Math.floor(playerYPos/tileSize);
    colOverlap = playerXPos%tileSize;
    rowOverlap = playerYPos%tileSize;

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

    //enemy collision
    //Horzontal collision
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

    //item pick up
    for(item in collectables){
      if(collectables[item].available && playerCollided(collectables[item],playerXPos,playerYPos)){
        collectables[item].available = false;
        switch(collectables[item].type){
          case "heart":
            addLife(player,collectables[item].qty);
            break; 
          case "object":
            inventory.push(collectables[item]);
            updateInventory(inventory);
            break;
          case "money":
            updateBank(bank, collectables[item].qty);
        }
      }
    }  
    //damage
    for(enemy in enemies){  
      if(playerCollided(enemies[enemy],playerXPos,playerYPos) && player.recovering === false){
        //take damage
        loseLife(player,enemies[enemy]);

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
        console.log(player.xspeed)
        console.log(enemies[enemy].xspeed)
      }
    }  
    //attack
      if(player.attacking){
        console.log('attack!');
        for(enemy in enemies){
          console.log("y%="+ (playerYPos) +"enemy" + (enemies[enemy].YPos));
          console.log("x%="+ (playerXPos) + (enemies[enemy].XPos));
          //up attack
          if(player.direction == "up" && playerYPos <= enemies[enemy].YPos + 50 && playerYPos > enemies[enemy].YPos && playerXPos <= enemies[enemy].XPos + 15 && playerXPos >= enemies[enemy].XPos - 15 ){
            console.log('uphit');
            enemies[enemy].hp -= player.attack;
          }
          //down attack
          if(player.direction == "down" && playerYPos >= enemies[enemy].YPos - 50 && playerYPos < enemies[enemy].YPos && playerXPos <= enemies[enemy].XPos + 15 && playerXPos >= enemies[enemy].XPos - 15 ){
            console.log('downhit');
            enemies[enemy].hp -= player.attack;
          }
          // //right attack
          if(player.direction == "right" && playerXPos >= enemies[enemy].YPos - 50 && playerXPos < enemies[enemy].XPos && playerYPos <= enemies[enemy].YPos + 15 && playerYPos >= enemies[enemy].YPos - 15 ){
            console.log('righthit');
            enemies[enemy].hp -= player.attack;
          }
          // //left attack
          if(player.direction == "left" && playerXPos <= enemies[enemy].YPos + 50 && playerXPos > enemies[enemy].XPos && playerYPos <= enemies[enemy].YPos + 15 && playerYPos >= enemies[enemy].YPos - 15 ){
            console.log('lefthit');
            enemies[enemy].hp -= player.attack;
          }
          if(enemies[enemy].hp <= 0){
          enemies[enemy].YPos = 0;
          enemies[enemy].XPos = 0;
          }
        }

        // player.attacking = false;
      }

      if(player.attacking){
        for(chest in chests){
          //up attack
          if(player.direction == "up" && playerYPos <= chests[chest].YPos + 50 && playerYPos > chests[chest].YPos && playerXPos <= chests[chest].XPos + 15 && playerXPos >= chests[chest].XPos - 15 ){
            chests[chest].open();
          }
          //down attack
          if(player.direction == "down" && playerYPos >= chests[chest].YPos - 50 && playerYPos < chests[chest].YPos && playerXPos <= chests[chest].XPos + 15 && playerXPos >= chests[chest].XPos - 15 ){
            chests[chest].open();
          }
          // //right attack
          if(player.direction == "right" && playerXPos >= chests[chest].YPos - 50 && playerXPos < chests[chest].XPos && playerYPos <= chests[chest].YPos + 15 && playerYPos >= chests[chest].YPos - 15 ){
            chests[chest].open();
          }
          // //left attack
          if(player.direction == "left" && playerXPos <= chests[chest].YPos + 50 && playerXPos > chests[chest].XPos && playerYPos <= chests[chest].YPos + 15 && playerYPos >= chests[chest].YPos - 15 ){
            chests[chest].open();
          }
          if(chests[chest].hp <= 0){
          chests[chest].YPos = 0;
          chests[chest].XPos = 0;
          }
        }

        // player.attacking = false;
      }  

    baseCol = Math.floor(enemyXPos/tileSize);
    baseRow = Math.floor(enemyYPos/tileSize);
    colOverlap = enemyXPos%tileSize;
    rowOverlap = enemyYPos%tileSize;

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

    renderLevel();

    requestAnimFrame(function() {
      updateGame();
    });
  }

  updateGame();

}) ();
