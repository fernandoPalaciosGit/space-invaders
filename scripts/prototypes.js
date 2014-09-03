///////////////////////////
// GAME ASSETS CONSTRUCTOR //
///////////////////////////
var Asset = function (x, y, w, h, hh){
	this.posX = x || 0;
	this.posY = y || 0;
	this.w  = w || 0;
	this.h = h || this.w;
	this.health = hh || 3;
	this.damage = 0;

	this.setHealth = function(h){
		this.health = h;
	};

	this.setDamage = function(d){
		this.damage = d;
	};
};

// additional player and machine properties
Asset.prototype.fill = function(ctx, color){
	ctx.fillStyle = color;
	ctx.fillRect(this.posX, this.posY, this.w, this.h);
};

// Assets collisions
Asset.prototype.intersect = function(asset){
	// this.constructor.prototype.isPrototypeOf(asset)
	if( asset instanceof this.constructor ){
		return	this.posX < (asset.posX + asset.w) &&
					(this.posX + this.w) > asset.posX &&
					this.posY < (asset.posY + asset.h) &&
					(this.posY + this.h) > asset.posY;
	}
};

// draw sprite Assets
Asset.prototype.drawImageArea = function (ctx, sprite, cutPosX, cutPosY, cutWidth, cutHeight, color){
	// check if the sprite image is loaded
	if( !!sprite.width ){
		ctx.drawImage(	sprite,
					cutPosX, cutPosY, cutWidth, cutHeight,   //cut the sprite image
					this.posX, this.posY,	//position the image inside the asset
					this.w, this.h );	//size the cut image in the canvas
	} else {
		this.fill(ctx, color);
	}
};

// aditional properties only for player spaceship
Asset.prototype.multishot = null;

/////////////////////////
// CONSTRUCTOR MENSAGES //
/////////////////////////
var Message = function (str, x, y){
	this.msg = str || '?';
	this.posX = x || 0;
	this.posY = y || 0;
};

///////////////////////
// STAR NCONSTRUCTOR //
///////////////////////
var Bgd = function (x, y, w, h, t){
	this.posX = x;
	this.posY = y;
	this.w = w;
	this.h = h;
	this.timer = t || 0;
};

// draw flashing stars
Bgd.prototype.flashing = function(ctx){
	// set new timer flashing (random flashing)
	this.timer += 2;
		if( this.timer > 120 ){
		this.timer -= 120;
	}

	// when we arrived at the end of flashing subtract half to avoid the abrupt change
	var c = 255 - Math.abs( 120 - this.timer);
	ctx.fillStyle = 'rgb('+c+','+c+','+c+')';
	ctx.fillRect( this.posX, this.posY, this.w, this.h );
}

// draw background canvas
Bgd.prototype.drawBgdCanvas = function(ctx, bgdCanvas, color){
	if( !!bgdCanvas.width ){ // check loaded image
		//timeout background move
		this.timer++;
      if( this.timer > 0 ) {
          this.timer -= this.h;
      }

      // draw two times background image delayed
      ctx.globalAlpha = 0.5;
		ctx.drawImage(	bgdCanvas, 0, this.timer,
							this.w, this.h);

		ctx.drawImage(	bgdCanvas, 0, this.timer + this.h,
							this.w, this.h);
		ctx.globalAlpha = 1;
		
	}else{
		ctx.fillStyle = color;
		ctx.fillRect( this.posX, this.posY, this.w, this.h );
	}
};

Bgd.createStars = function( numStars, w, h){
	for(var i = 0; i < numStars; i++){	
		this.stars.push(
			// random timer flashing for each star
			new Bgd( random(GAME.canvasBgd.width), random(GAME.canvasBgd.height), w, h, random(100) ) );
	}
};

/////////////////////////
// SCENES CONSTRUCTOR //
/////////////////////////
var Scene = function (){
	// set id scene from last index constructor Array scenes
	this.id = this.constructor.addScenes.length;
	this.constructor.addScenes.push(this);
};

// Propiedades estaticas de constructor (this.contructor)
Scene.addScenes = [];
Scene.currentScene = null;

// propiedades publicas de instancias (implementacion particular de cada escena)
Scene.prototype.act = function (){};
Scene.prototype.paint = function (ctx, ctxBgd){};
Scene.prototype.load = function (){};

////////////////////////
// VARIABLES GLOBALES //
////////////////////////
var GAME = {
	canvas: document.querySelector('.invadersCanvas canvas'),
	ctx: document.querySelector('.invadersCanvas canvas').getContext('2d'),
	canvasBgd: document.querySelector('.bgdCanvas canvas'), 
	ctxBgd: document.querySelector('.bgdCanvas canvas').getContext('2d'),
	//Assets for improvemnet
	powerups: {
		multiShots: [],
		extraPoints: [],
		messages: [],
		extraHealth: []
	},
	// kind of our game Scenes
	scenes:{
		invaders: new Scene(),
		jokerEnemy: new Scene()
	},
	// Asset for the gamer
	player: {
		spaceShip: new Asset(0, 0, 20, 20),
		spaceShot: []
	},
	// Assets for enemies
	machine:{
		invaders: []
	},
	sprite: new Image(),
	bdgCanvas: new Image(),
	animTimerSprite: 0, // animate some sprites
	keys: {
		lastPress: null,
		isPressing : [],
		allowed : {
			KEY_LEFT : 37,
			KEY_UP : 38,
			KEY_RIGHT : 39,
			KEY_DOWN : 40,
			KEY_ENTER: 13,
			KEY_SPACE: 32
		}
	},
	paused : false,
	gameover: false,
	score: 0
};

// static constructor functions, for background canvas
Bgd.stars = [];
// create Bgd canvas (tile image for vertical movement)
Bgd.cosmos = new Bgd( 0, 0, GAME.canvas.width, GAME.canvas.height, 0);