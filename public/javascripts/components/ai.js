
module.exports = function() {
  return {
    walker: function(item, counter) {
      var speed    = item.maxSpeed;
      var random   = randomNumBetween(4);
      var thisItem = item;
      var pace     = counter;

      if(pace >= 100 && pace < 110){
        thisItem.xspeed = 0;
        thisItem.yspeed = 0;
      }
     if(pace === 220){
        thisItem.xspeed = 0;
        thisItem.yspeed = 0;
        pace = 0;
      }
      if(pace === 10){
        thisItem.xspeed = 0;
        thisItem.yspeed = 0;
        switch(random){
          case 1:
            thisItem.xspeed = -(speed);
            break;
          case 2:
            thisItem.xspeed = speed;
            break;
          case 3:
            thisItem.yspeed = -(speed);
            break;
          case 4:
            thisItem.yspeed = speed;
            break;
        }
      }
      else if(pace === 110){
        thisItem.xspeed = 0;
        thisItem.yspeed = 0;
        switch(random){
          case 1:
            thisItem.xspeed = -(speed);
            break;
          case 2:
            thisItem.xspeed = speed;
            break;
          case 3:
            thisItem.yspeed = -(speed);
            break;
          case 4:
            thisItem.yspeed = speed;
            break;      
        }
      }
    },
    seeker : function(item, counter, player) {
      var thisItem    = item;
      var speed       = thisItem.maxSpeed;
      var pace        = counter;
      var distPlayerX = thisItem.XPos - player.XPos;
      var distPlayerY = thisItem.YPos - player.YPos;
      var thisTurn    = Math.abs(distPlayerX) > Math.abs(distPlayerY);
      var inRange     = withinRange(thisItem, player, 300);

      if(counter > 50 && counter < 71 || counter > 120 && counter < 141) {
        thisItem.yspeed = 0;
        thisItem.xspeed = 0;
      }
      else if(inRange && (counter === 71 || counter === 141)) {
        switch(thisTurn) {
          case true:
            thisItem.yspeed = 0;
            thisItem.xspeed = distPlayerX > 0 ? -(speed) : speed;
            break;
          case false:
            thisItem.xspeed = 0;
            thisItem.yspeed = distPlayerY > 0 ? -(speed) : speed;
            break;
        }
      } 
    }
  }    
};