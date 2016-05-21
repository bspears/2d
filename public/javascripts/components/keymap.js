//Key mapping
  
function keyMap(){
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
      case 32:
        player.jumping = false;
        break;
      case 16:
        player.attacking = false;
        break;
    }
  }, false);
}

