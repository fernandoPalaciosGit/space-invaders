///////////////////////////
// CONSTRUCTOR DE INVADERS //
///////////////////////////


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
	asset: {
		posX: 50,
		posY: 50,
		w: 10,
		h: 10
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
