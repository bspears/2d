//Key mapping
  
module.exports = (function(player) {
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
});

