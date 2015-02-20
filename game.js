///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //

// TODO: DECLARE and INTIALIZE your constants here
var START_TIME = currentTime();

var BACKGROUND = loadImage("gameBackground.jpg");
var PLAYER_IMAGE = loadImage("player.png");
var BULLET_IMAGE = loadImage("bullet.png");
var ENEMY_IMAGE = loadImage("enemy.png");
var EXPLOSION_IMAGE = loadImage("explosion.png");
var ENEMY_BULLET_IMAGE = loadImage("enemybullet.png");

var BULLET_SOUND = loadSound("bulletsound.wav");
var EXPLOSION_SOUND = loadSound("explosion.wav");

var BULLET_SPEED = 700;
var PLAYER_SPEED = 1000;
var ENEMY_SPEED = 30;





///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

// TODO: DECLARE your variables here
var lastKeyCode;


var player;
var enemies;
var enemyBullets;
var bullets;
var explosion;

var resetFlag = false;

var clearBonus = false;

var Score = 0;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //
defineGame("Space Invaders", "Brandon Yagihashi", "title.png");
// When setup happens...
function onSetup() {
    // TODO: INITIALIZE your variables here

    lastKeyCode = 0;


    player = makeObject();

    player.image = PLAYER_IMAGE;

    player.width = 128;
    player.height = 128;

    player.pos = makeObject();
    player.pos.x = screenWidth/2;
    player.pos.y = screenHeight *.90;

    player.vel = makeObject();
    player.vel.x = 0;
    player.vel.y = 0;

    player.leftKey     = asciiCode('A');
    player.leftActive  = false;

    player.rightKey    = asciiCode('D');
    player.rightActive = false;

    player.spaceBar = asciiCode(' ');
    player.barActive = false;

    player.q = asciiCode('Q');


    player.lastfire = 0;



    bullets = [];
    enemyBullets = [];
    enemies = [];


    var num= 0;
    setTimeout(function(){
        while(num < 12){
          buildEnemy(screenWidth/6 + num*115, 0);
          num++;
        }
    }, 1000);

    var num1= 0;
    setInterval(function(){
    if(!resetFlag){
      while(num1 < 12){
        buildEnemy(screenWidth/6 + num1*115, 0);
        num1++;
      }
    }
    }, 6000);


    setInterval(function(){
      buildEnemyBullets(enemies[randomInteger(0,length(enemies))].pos.x,enemies[randomInteger(0,length(enemies))].pos.y);
    }, 8000);


}




// When a key is pushed
function onKeyStart(key) {
  var now = currentTime();
  var time =1.0/30.0;
    if (key == player.leftKey) {
        player.leftActive = true;


    }

    if (key == player.rightKey) {
        player.rightActive = true;


    }
    if(key == player.spaceBar){
      player.barActive = true;
      buildBullets(player.pos.x, player.pos.y - player.image.height/ 2);
      playSound(BULLET_SOUND);
      player.lastfire = now;


    }
    if(key == player.q){
      strokeLine(player.pos.x,player.pos.y, player.pos.x, player.pos.y - 1000, "white", 50);
    }
}


function onKeyEnd(key) {

    if (key == player.leftKey) {
        player.leftActive = false;
    }

    if (key == player.rightKey) {
        player.rightActive = false;
    }
    if(key == player.spaceBar){
      player.barActive = false;
    }
}

// Called 30 times or more per second
function onTick() {
    var time = 1.0/30.0;

    movePlayer(time);
    moveBullets(time);
    moveEnemies(time);
    moveEnemyBullets(time);
    doCollisions(time);
    doPlayerColl();
    buildGraphics();

    if(resetFlag){
      reset();
      Score = 0;
      resetFlag = false;
    }

}



///////////////////////////////////////////////////////////////
//                                                           //
//                      HELPER RULES                         //

function movePlayer(time){

    if ((player.leftActive && ! player.rightActive) && (player.pos.x > 55)) {
        player.pos.x = player.pos.x - PLAYER_SPEED * time;
    } else if ((! player.leftActive && player.rightActive) && (player.pos.x < screenWidth -55)) {
        player.pos.x = player.pos.x + PLAYER_SPEED * time;
    }


}

function buildGraphics(){
      var b = 0;
      var bullet;

      var e = 0;
      var enemy;

      var eb=0;
      var enemyBullet;

      clearRectangle(0, 0, screenWidth, screenHeight);
      drawImage(BACKGROUND,0,0,screenWidth,screenHeight);

      while (b < length(bullets)) {
          bullet = bullets[b];
          drawposed(bullet);
          b = b + 1;
      }
      while(e < length(enemies)){
        enemy = enemies[e];
        drawposed(enemy);
        e = e+1;
      }
      while(eb < length(enemyBullets)){
        enemyBullet = enemyBullets[eb];
        drawposed(enemyBullet);
        eb = eb+1;
      }
      fillText(Score, screenWidth/20, screenHeight/12,"white", "bold 64px Helvetica", "left", "top");
      if(clearBonus){
        fillText("Clear Bonus + 1000!", screenWidth/15, screenHeight/12, "white", "bold 64px Helvetica", "left", "top");
      }
      drawposed(player);




}



function buildBullets(x,y){
      var bullet;

      bullet = makeObject();

      bullet.image = BULLET_IMAGE;


      bullet.pos = makeObject();
      bullet.pos.x = x;
      bullet.pos.y = y;

      bullet.width = makeObject();
      bullet.width = 35;

      bullet.height = makeObject();
      bullet.height = 35;

      insertBack(bullets, bullet);

}

function moveBullets(time){
    var b;
    var bullet;

    b = 0;
    while (b < length(bullets)) {
        bullet = bullets[b];

       bullet.pos.y = bullet.pos.y - BULLET_SPEED * time;

        if (bullet.pos.y + bullet.image.height / 2 < 0) {

            removeAt(bullets, b);
        } else {

            b = b + 1;
        }
    }
}

function buildEnemy(x,y){
      var enemy;

      enemy = makeObject();
      enemy.image = ENEMY_IMAGE;

      enemy.pos = makeObject();
      enemy.pos.x = x;
      enemy.pos.y = y;

      enemy.width = makeObject();
      enemy.width = 128;

      enemy.height = makeObject();
      enemy.height = 128;

      enemy.isHit = false;
      insertBack(enemies, enemy);

}
function moveEnemies(time){
      var e;
      var enemy;

      e = 0;
      while(e < length(enemies)){
        enemy = enemies[e];
        setInterval(function(){
            enemy.pos.x = enemy.pos.x + 5*time;
            enemy.pos.x = enemy.pos.x - 5*time;
        }, 5000)

        enemy.pos.y = enemy.pos.y + ENEMY_SPEED*time;
        e++;
      }

}

function buildEnemyBullets(x,y){
      var enemyB;

      enemyB = makeObject();

      enemyB.image = ENEMY_BULLET_IMAGE;

      enemyB.pos = makeObject();

      enemyB.pos.x = x;
      enemyB.pos.y = y;

      enemyB.width = makeObject();
      enemyB.width = 32;

      enemyB.height = makeObject();
      enemyB.height = 32;

      insertBack(enemyBullets, enemyB);

}
function moveEnemyBullets(time){
  var eb;
  var ebullet;

  eb = 0;
  while (eb < length(enemyBullets)) {
     ebullet = enemyBullets[eb];
     ebullet.pos.y = ebullet.pos.y + BULLET_SPEED * time;
      if (ebullet.pos.y - ebullet.image.height / 2 < 0) {

          removeAt(enemyBullets, eb);
      } else {

          eb = eb + 1;
      }
  }

}


function drawposed(object){
    drawImage(object.image,
              object.pos.x - object.image.width / 2,
              object.pos.y - object.image.height / 2);
}


function doCollisions() {

    var b;
    var e;
    for(i=0;i<length(enemies);i++){
      for(k=0;k<length(bullets);k++){
        if(collides(enemies[i],bullets[k])){

          enemies[i].image = EXPLOSION_IMAGE;
          playSound(EXPLOSION_SOUND);

          b = k;
          e = i;
          removeAt(bullets, b);
          setTimeout(function(){removeAt(enemies, e)}, 100);
          Score += 200;


        }

      }
    }

}

function doPlayerColl(){

    for(i=0;i<length(enemyBullets);i++){
      if(collides(player,enemyBullets[i]) || collides(player, enemies[i])){
        player.image = EXPLOSION_IMAGE;
        playSound(EXPLOSION_SOUND);
        resetFlag = true;


      }
    }

}


function collides(obj1,obj2){
    if (obj1.pos.x < obj2.pos.x + obj2.width &&
       obj1.pos.x + obj1.width > obj2.pos.x &&
       obj1.pos.y < obj2.pos.y + obj2.height &&
       obj1.height + obj1.pos.y > obj2.pos.y) {
        return true;
    }

}
