var init = function (evLoad){
	document.addEventListener('keydown', onKeyPressed, false);
	document.addEventListener('keyup', offKeyPressed, false);
	window.addEventListener('resize', setCanvasFullScreen, false);

	// create sprites
	GAME.sprite.onerror = function(evError){
		this.src = 'http://www.pcengine.co.uk/sunteam/pics_unfinished/HSS_sprites.png';
		this.onerror = ''; // no more errors; ensure that the server is not fallen
	};
   GAME.sprite.src = 'assets/images/gameSprite.png';

   // create background image
   GAME.bdgCanvas.onerror = function(evError){
   	this.src = 'https://sites.google.com/site/juegoscanvas/nebula.jpg';
   	this.onerror = ''; // no more errors; ensure that the server is not fallen
   };
   GAME.bdgCanvas.src = 'assets/images/canvasBgd.jpg';

   // create 200 Bgd Stars, 2*2 dimensions
   Bgd.createStars(400, 1, 1);

	// load the Invaders scene
	loadScene(GAME.scenes.invaders);

	setCanvasFullScreen();
	run();
	repaint();
};

// GLOBAL VARIABLES
var GAME = {
	canvas: document.querySelector('.invadersCanvas canvas'),
	ctx: document.querySelector('.invadersCanvas canvas').getContext('2d'),
	canvasBgd: document.querySelector('.bgdCanvas canvas'), 
	ctxBgd: document.querySelector('.bgdCanvas canvas').getContext('2d'),
	// game sounds: initPool(typePool, volumePool, looping)
	sounds: {
		laser: ( function(){
					var sound = new SoundPool(10);
					sound.initPool('laser', 0.1, false);
					return sound;
				}() ),
		explotion: ( function(){
					var sound = new SoundPool(20);
					sound.initPool('explotion', 0.1, false);
					return sound;
				}() ),
		death: ( function(){
					var sound = new SoundPool(1);
					sound.initPool('death', 0.1, false);
					return sound;
				}() ),
		game: ( function(){
					var sound = new SoundPool(1);
					sound.initPool('bgdGame', 0.15, true);
					return sound;
				}() ),
		loose: ( function(){
					var sound = new SoundPool(1);
					sound.initPool('endGame', 0.25, true);
					return sound;
				}() ),
	},
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
		invaders: [],
		joker: {
			asset: new Asset(0, 10, 30, 30), // yellow spacecraft
			spaceShot: [],
			shooterTimer: 0 // delay joker shooter
		},
		greenGoblin: new Asset(0, 0, 30, 30) // green boss
	},
	sprite: new Image(),
	bdgCanvas: new Image(),

	animTimerSprite: 0, // animate some sprites
	// kind of our game Scenes
	scenes:{
		invaders: null,
		jokerEnemy: null
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

// INIT GLOBAL VARIABLES
// static constructor functions, for background canvas
Bgd.stars = [];
// create Bgd canvas (tile image for vertical movement)
Bgd.cosmos = new Bgd( 0, 0, GAME.canvas.width, GAME.canvas.height, 0);
// create scene prototype and constructor heritance
GAME.scenes.invaders = new Scene();
GAME.scenes.jokerEnemy = new Scene();

// indicar el estado de tecla presionada
var onKeyPressed = function(evKeyDown){
	GAME.keys.lastPress = evKeyDown.which || evKeyDown.keyCode;
	GAME.keys.isPressing[ GAME.keys.lastPress ] = true;
};

// desactivar la tecla presionada
var offKeyPressed = function (evKeyUp){
	GAME.keys.lastPress = evKeyUp.which || evKeyUp.keyCode;
	GAME.keys.isPressing[ GAME.keys.lastPress ] = false;
};

var repaint = function (){
	requestAnimFrame(repaint);
	resizeBuffer(350, 500);
	// load render canvas Scene(), of actually scene
	Scene.addScenes[ Scene.currentScene ].paint(GAME.ctx, GAME.ctxBgd);
};

var run = function (){
	window.setTimeout(run, 1000/40); //FPS
	// load action scene of actually scene
	Scene.addScenes[ Scene.currentScene ].act();
};

// set the current Scene
var loadScene = function (sn){
	Scene.currentScene = sn.id;
	// al inicializar o resetear el juego estara pausado y sin movimientos previos
	Scene.addScenes[ Scene.currentScene ].load(); // sn.load()
};

document.addEventListener('DOMContentLoaded', init, false);