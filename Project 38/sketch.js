var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;
var canvasX,canvasY;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  canvasX = displayWidth - 100;
  canvasY = displayHeight - 100;
  createCanvas(canvasX, canvasY);
  
  trex = createSprite(canvasX/2 -600 ,canvasY/2-100,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(canvasX/2,canvasY/2-100,canvasX,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /5;
  ground.scale = displayWidth/150;
  ground.velocityX = -(6 + 3*score/100);
  camera.position.x = ground.x;
  
  gameOver = createSprite(displayWidth/2,displayHeight/10);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,40+displayHeight/10);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(canvasX/2,canvasY/2-80,displayWidth,10);
  invisibleGround.visible = false;
  invisibleGround.scale = displayWidth/150;
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(180);
  text("Score: "+ score, camera.position.x + 400,50);
  //Set the Gameover and Restart sprite position according to Game Camera
  gameOver.x = camera.position.x;
  restart.x = camera.position.x;
  //Make the trex move in forward direction
  trex.velocityX = 1;
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    //set the camera position on the trex    
    camera.position.x = trex.x;
    
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
    //adding gravity
    trex.velocityY = trex.velocityY + 0.8
    
    //Reseting the ground
    if (ground.x < 0){
      ground.x = ground.width/5;      
    }
    //spawning clouds
    spawnClouds();
    //spawning obstacles
    spawnObstacles();
    
    //When the trex collides with obstacles, end the game
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    //make the trex stop
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  //collide the trex with invisible ground
  trex.collide(invisibleGround);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  //Clouds should get spawned according to camera position now
  if (camera.position.x % 60 === 0) {    
    var cloud = createSprite(displayWidth,displayHeight/2 - 200 ,40,10);
    cloud.y = Math.round(random(80,displayHeight/2 - 400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = Math.round(displayWidth/3);
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }  
}

function spawnObstacles() {
  //Obstacles should get spawned according to camera position now
  if(camera.position.x % 60 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight/4,10,40);    
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = (displayWidth/(-1*obstacle.velocityX));
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;  
}