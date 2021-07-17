/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;


var jungle, invisiblejungle;
var obstacle;
var obstaclesGroup, obstacle1;
var kangaroo
var score=0;

var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("kangaroo1.png","kangaroo2.png","kangaroo3.png");
  kangaroo_collided = loadAnimation("kangaroo1.png");
  jungleImage = loadImage("bg.png");
  shrub1 = loadImage("shrub1.png");
  shrub2 = loadImage("shrub2.png");
  shrub3 = loadImage("shrub3.png");
  obstacle1 = loadImage("stone.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.wav");
  collidedSound = loadSound("collided.wav");
}

function setup() {
  createCanvas(800, 400);

  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  jungle = createSprite(400,100,400,20);
  jungle.addImage(jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  //gameOver = createSprite(300,100);
  //gameOver.addImage(gameOverImg);
  
  //restart = createSprite(300,140);
  //restart.addImage(restartImg);
 //gameOver.scale = 0.2;
  //restart.scale = 0.2;
  kangaroo = createSprite(200,340,30,30);
  kangaroo.addAnimation("kangaroo",kangaroo_running);
  kangaroo.scale=0.2;
  ground = createSprite(200,500,400,10);
  ground.x = ground.width /2;
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  

  kangaroo.setCollider("rectangle",0,0,kangaroo.width,kangaroo.height);
  kangaroo.debug = true
  score = 0;

}

function draw() {
  background(255);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && kangaroo.y >= 159) {
      kangaroo.velocityY = -12;
    }
  kangaroo.x=camera.position-270;
    kangaroo.velocityY = kangaroo.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    kangaroo.collide(invisibleGround);
    spawnShrubs();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(kangaroo)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    kangaroo.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    
    //change the trex animation
    kangaroo.changeAnimation("collided",kangaroo_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    shrubsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnShrubs() {
  //write code here to spawn the clouds
  if (frameCount % 250 === 0) {
    var shrubs = createSprite(camera.position.x+500,330,40,10);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: shrubs.addImage(shrub1);
              break;
              case 1: shrubs.addImage(shrub2);
              break;
              case 1: shrubs.addImage(shrub3);
              break;
      default: break;
    }
    shrubs.scale = 0.5;
    shrubs.velocityX = -3;
    
     //assign lifetime to the variable
    shrubs.lifetime = 300;
    
    //adjust the depth
    shrubs.depth = kangaroo.depth;
    kangaroo.depth = kangaroo.depth + 1;
    
    //add each cloud to the group
    shrubsGroup.add(shrubs);
  }
  
}

function spawnObstacles() {
  if(frameCount % 200 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  shrubsGroup.destroyEach();
  
  kangaroo.changeAnimation("running",kangaroo_running);
  
 
  
  score = 0;
  
}
  
