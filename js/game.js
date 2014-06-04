
        //STARTING SCORE
var score = 0;

//NUMBER OF LIVES

var lives = 3;

var AlienFlock = function AlienFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 10;      //this controls how fast the aliens are.

  this.draw = function() {};
    //This is where you load next level or if there are no more levels to be loaded it will load up the win screen.
    
  this.die = function() {
      this.alive = false;
      
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel())); 
    } else {
      Game.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;            //this determines if the aliens move down the y axis when they move frames
    }
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Alien)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}



var Alien = function Alien(opts) {          
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;              //This determines the start position of the aliens on the x axis
}

Alien.prototype.draw = function(canvas) {
  Sprites.draw(canvas,this.name,this.x,this.y,this.frame);
}

//this is the part of the code where i can change what events happen when alien dies//
Alien.prototype.die = function() {
  GameAudio.play('die');
  this.flock.speed += 1;  //here is where there is a rule added where when alien dies it increseas the speed of the alien flock
  this.board.remove(this);
    score = score +1;
    document.getElementById('score').innerHTML="SCORE : " + score;
    
    
}

Alien.prototype.step = function(dt) {
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
  if(Math.abs(this.mx) > 10) {
    if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    //this is where i change the frame count of the aliens i changed it to 2 frames//
    this.x += this.mx;
    this.mx = 0;
    this.frame = (this.frame+1) % 3;
    if(this.x > Game.width - Sprites.map.alien1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.alien1.w) this.flock.hit = 1;
  }
  return true;
}
//this is where u change the fire rate of the aliens
Alien.prototype.fireSometimes = function() {
      if(Math.random()*100 < 10) {
                //This is where i can change the missles that the aliens will fire
        this.board.addSprite('missile',this.x + this.w/2 - Sprites.map.missile.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }
}
            //PLAYER DETAILS
var Player = function Player(opts) { 
  this.reloading = 0;
}

Player.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'player',this.x,this.y);
}


Player.prototype.die = function() {
  GameAudio.play('die');
    Game.callbacks['loseLife']();
    loseLife();
    loseLifeScreen();
    
    if(lives <= 0){
        Game.callbacks['die']();
        lives = 3;
        
        };
    
    
    
}
    
//player movement control

Player.prototype.step = function(dt) {
  if(Game.keys['left']) { this.x -= 100 * dt; }
  if(Game.keys['right']) { this.x += 100 * dt; }
  if(Game.keys['up']) { this.y -= 100* dt; }
  if(Game.keys['down']) { if(this.y < 480) { this.y += 100* dt; }
      
  }

  if(this.x < 0) this.x = 0;
  if(this.x > Game.width-this.w) this.x = Game.width-this.w;

  if(this.y < 400) this.y = 400;
  if(this.height > Game.height) this.height  = Game.height - this.y;

    
    // missle data
  this.reloading--;

//this is where I change the players fire rate.
  if(Game.keys['fire'] && this.reloading <= 1 && this.board.flames < 3) {
    GameAudio.play('fire');
    this.board.addSprite('flame',
                          this.x + this.w/2 - Sprites.map.flame.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.flames++;
    this.reloading = 8;
  }
  return true;
}

var Flame = function Flame(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
}

Flame.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'flame',this.x,this.y);
}

Flame.prototype.step = function(dt) {
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}

Flame.prototype.die = function() {
  if(this.player) this.board.flames--;
  if(this.board.flames < 0) this.board.flames=0;
   this.board.remove(this);
}




var Missile = function Missile(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
}

Missile.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'missile',this.x,this.y);
}

Missile.prototype.step = function(dt) {
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}

Missile.prototype.die = function() {
  if(this.player) this.board.missiles--;
  if(this.board.missiles < 0) this.board.missiles=0;
   this.board.remove(this);
}


