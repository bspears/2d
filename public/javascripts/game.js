(function() {
  var port = document.getElementById('viewport');
  var leftScroll = document.getElementById('viewport').scrollLeft;
  var scrollTop = document.getElementById('viewport').scrollTop;
  var canvas = document.getElementById('canvas');
  var lives = document.getElementById('lives');
  var context = canvas.getContext('2d');
  var levelCols = 300;
  var levelRows = 16;
  var tileSize = 30;
  var leftPressed = false;
  var rightPressed = false;
  var upPressed = false;
  var downPressed = false;
  var jumpPressed = false;
  var movementSpeed = 5;
  var gravity = 20;
  var jumpStart = 0;
  var jumpHeight = 0;
  var maxJump = 15;
  var jumping = false;
  var falling = false;
  var friction = .8;
  var canJump = true;
  var playerTop = (playerYPos-tileSize)*tileSize;
  var playerBottom = (playerYPos+tileSize)*tileSize;
  var playerleft = (playerXPos-tileSize)*tileSize;
  var playerRight = (playerXPos+tileSize)*tileSize;


  var player = {
    "name" : "Rupert",
    "lives" : 3,
    "jumping" : false,
    "maxSpeed" : 5,
    "row" : 13,
    "col" : 5,
    "xspeed" : 0,
    "yspeed" : 0,
    "attack" : 1,
  }

  var enemy = {
    "col" : 10,
    "row" : 13,
    "hp" : 1,
    "xspped" : 0,
    "yspeed" : 0,
    "attack" : 1
  }
  console.log(player);


  var level = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  var playerYPos = player.row*tileSize;
  var playerXPos = player.col*=tileSize;

  var enemyYPos = enemy.row*tileSize;
  var enemyXPos = enemy.col*=tileSize;

  canvas.width = tileSize*levelCols;
  canvas.height = tileSize*levelRows;

  //register key presses
  document.addEventListener('keydown', function(e){
    console.log(e.keyCode);
    switch(e.keyCode){
      case 65:
        leftPressed = true;
        break;
      case 87:
        upPressed = true;
        break;
      case 68:
        rightPressed = true;
        break;
      case 83:
        downPressed = true;
        break;
      case 32:
        player.jumping = true;
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
    }
  }, false);


  //build level
  function renderLevel(){
    //walls
    context.clearRect(0,0, canvas.width, canvas.height);
    context.fillStyle = '#999';
    for(i=0;i<levelRows;i++){
      for(j=0;j<levelCols;j++){
        if(level[i][j]==1){
          context.fillRect(j*tileSize,i*tileSize,tileSize,tileSize);
        }
      }
    }

    //enemy1
    context.fillStyle = '#ff3333';
    context.fillRect(enemyXPos,enemyYPos,tileSize,tileSize);

    //player
    context.fillStyle = '#5588ee';
    context.fillRect(playerXPos,playerYPos,tileSize,tileSize);

    context.fillStyle = '#ddd';
    context.fillRect(playerXPos,playerTop,tileSize,tileSize);
  }



  //Frame rate
  window.requestAnimFrame = (function(callback) {
    return window.requestAnimFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000/60);
    };
  }) ();


  function updateGame() {
    lives.textContent = "Lives" + " " +player.lives;
    player.yspeed = 0;
    player.xspeed = 0;

    if(rightPressed){
      player.xspeed=player.maxSpeed;
    }
    else{
      if(leftPressed){
        player.xspeed=-movementSpeed;
      }
      else{
        if(upPressed){
          player.yspeed=-movementSpeed;
        }
        else{
          if(downPressed){
            player.yspeed=movementSpeed;
          }
        }
      }
    }

    // movementSpeed *= friction;

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



    //scrolling
    if(playerXPos>(leftScroll+650)){
      port.scrollLeft+=7;
    }
    else{
      if(playerXPos<(leftScroll+50)){
        port.scrollLeft-=7;
      }
    }

    if(playerYPos>scrollTop){
      //Do stuff
    }
    else{
      if(playerYPos<scrollTop){
        //do other stuff
      }
    }


    var baseCol = Math.floor(playerXPos/tileSize);
    var baseRow = Math.floor(playerYPos/tileSize);
    var colOverlap = playerXPos%tileSize;
    var rowOverlap = playerYPos%tileSize;

    //Horzontal collision
    if(player.xspeed>0){
      if((level[baseRow][baseCol+1] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow+1][baseCol] && rowOverlap)){
        playerXPos=baseCol*tileSize;
      }
    }

    if(player.xspeed<0){
      if((!level[baseRow][baseCol+1] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow+1][baseCol] && rowOverlap)){
        playerXPos=(baseCol+1)*tileSize;
      }
    }

    baseCol = Math.floor(playerXPos/tileSize);
    baseRow = Math.floor(playerYPos/tileSize);
    colOverlap = playerXPos%tileSize;
    rowOverlap = playerYPos%tileSize;

    //Vertical collision
    if(player.yspeed>0){
      if((level[baseRow+1][baseCol] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow][baseCol+1] && colOverlap)){
        playerYPos = baseRow*tileSize;
      }
    }

    if(player.yspeed<0){
      if((!level[baseRow+1][baseCol] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow][baseCol+1] && rowOverlap)){
        playerYPos=(baseRow+1)*tileSize;
      }
    }

    //enemy collision
    //Horzontal collision
    if(enemy.xspeed>0){
      if((level[baseRow][baseCol+1] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow+1][baseCol] && rowOverlap)){
        enemyXPos=baseCol*tileSize;
      }
    }

    if(enemy.xspeed<0){
      if((!level[baseRow][baseCol+1] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow+1][baseCol] && rowOverlap)){
        enemyXPos=(baseCol+1)*tileSize;
      }
    }

    //damage
    if(playerYPos == enemyYPos && playerXPos == enemyXPos) {
      //take damage
      loseLife(player);
      console.log(player.lives);
      //bump backward
      if(player.xspeed>0){
        playerXPos -=80;
      }
      else if(player.xspeed<0){
        playerXPos +=80;
      }
      else if(player.yspeed>0){
        playerYPos -=80;
      }
      else if(player.yspeed<0){
        playerYPos +=80;
      }

      //safe period
    }

    //attack

    //hitboxes




    // if(attacking){

    // }

    baseCol = Math.floor(enemyXPos/tileSize);
    baseRow = Math.floor(enemyYPos/tileSize);
    colOverlap = enemyXPos%tileSize;
    rowOverlap = enemyYPos%tileSize;

    //Vertical collision
    if(enemy.yspeed>0){
      if((level[baseRow+1][baseCol] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow][baseCol+1] && colOverlap)){
        enemyYPos = baseRow*tileSize;
      }
    }

    if(enemy.yspeed<0){
      if((!level[baseRow+1][baseCol] && level[baseRow][baseCol]) || (!level[baseRow+1][baseCol+1] && level[baseRow][baseCol+1] && rowOverlap)){
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
