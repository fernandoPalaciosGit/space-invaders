///////////////////////////
// CONSTRUCTOR DE ASSETS //
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

////////////////////////
// VARIABLES GLOBALES //
////////////////////////
var GAME = {
	canvas: document.querySelector('.invadersCanvas canvas'),
	ctx: document.querySelector('.invadersCanvas canvas').getContext('2d'),
	//Assets for improvemnet
	powerups: {
		multiShots: [],
		extraPoints: [],
		messages: [],
		extraHealth: []
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