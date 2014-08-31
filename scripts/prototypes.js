///////////////////////////
// CONSTRUCTOR DE ASSETS //
///////////////////////////
var Asset = function (x, y, w, h){
	this.posX = x || 0;
	this.posY = y || 0;
	this.w  = w || w;
	this.h = h || h;
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
	paused : false,
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
			KEY_ENTER: 13
		}
	},
	score: 0
};
