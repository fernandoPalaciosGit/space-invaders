///////////////////////////
// CONSTRUCTOR DE ASSETS //
///////////////////////////
var Asset = function (x, y, w, h){
	this.posX = x || 0;
	this.posY = y || 0;
	this.w  = w || w;
	this.h = h || h;
};

Asset.prototype.fill = function(ctx, color){
	ctx.fillStyle = color;
	ctx.fillRect(this.posX, this.posY, this.w, this.h);
};

/////////////////////////
// CONSTRUCTOR ESCENAS //
/////////////////////////


////////////////////////
// VARIABLES GLOBALES //
////////////////////////
var GAME = {
	canvas: document.querySelector('.invadersCanvas canvas'),
	ctx: document.querySelector('.invadersCanvas canvas').getContext('2d'),
	player: {
		spaceShip: new Asset(0, 0, 10, 10),
		spaceShot: []
	},
	machine:{
		invaders: []
	},
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
