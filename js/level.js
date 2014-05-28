// this is where i add and edit the levels of my game.//
  var levelData = { 
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,2,2,2,0,0,0,0],
          [0,0,0,0,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,0,0,0,0],
          [0,0,0,0,2,2,2,0,0,0,0],
          [0,0,0,0,2,2,2,0,0,0,0],
          [0,0,0,1,1,1,1,1,0,0,0],
          [0,0,0,2,1,1,1,2,0,0,0],
          [0,0,0,1,1,1,1,1,0,0,0],
          [0,0,0,1,1,1,1,1,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0]],
    3:   [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,2,2,2,0,0,0,0,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0]]};

  var spriteData = {
    'alien1': { sx: 0,  sy: 0,  w: 24, h: 17, cls: Alien, frames: 2 },
    'alien2': { sx: 0,  sy: 15, w: 24, h: 17, cls: Alien, frames: 2 },
    'player': { sx: 0,  sy: 44, w: 25, h: 29, cls: Player },
    'missile': { sx: 0,  sy: 74, w: 6,  h: 15, cls: Missile, frames:5  }
  }

function loseLife(){
  if(this.Player) lives = lives -1;
    document.getElementById('lives').innerHTML="LIVES : " + lives; 
  }


function loseLifeScreen() {
    var screen = new GameScreen("SCORE : "+score+" ","you have "+lives+" lives left",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);

  }

  function startGame() {
    var screen = new GameScreen("Charizard Attaack","press space to start",
                                
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {
    var screen = new GameScreen("GAME OVER","press space to restart",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                      document.getElementById('lives').innerHTML="LIVES : " + lives;
                                      
                                     score = 0;
                                     document.getElementById('score').innerHTML="SCORE : " + score;
                                     
                            
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("You Win!","(press space to restart)",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }
  
  
//this is where i change the sound files
  $(function() {
    GameAudio.load({ 'fire' : 'media/laser.ogg', 'die' : 'media/explosion.ogg' }, 
                  function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "loseLife" : loseLifeScreen,
                                        "win"  : winGame });
                                        
                   });
   });



