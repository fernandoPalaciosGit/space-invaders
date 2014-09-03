var init = function (evLoad){
	document.addEventListener('keydown', onKeyPressed, false);
	document.addEventListener('keyup', offKeyPressed, false);
	window.addEventListener('resize', setCanvasFullScreen, false);

	// create sprites
	GAME.sprite.onerror = function(evError){
		this.src = 'http://www.pcengine.co.uk/sunteam/pics_unfinished/HSS_sprites.png';
		this.onerror = ''; // no more errors; ensure that the server is not fallen
	};
   GAME.sprite.src = 'assets/gameSprite.png';

   // create background image
   GAME.bdgCanvas.onerror = function(evError){
   	this.src = 'https://sites.google.com/site/juegoscanvas/nebula.jpg';
   	this.onerror = ''; // no more errors; ensure that the server is not fallen
   };
   GAME.bdgCanvas.src = 'assets/canvasBgd.jpg';

   // create 200 Bgd Stars, 2*2 dimensions
   Bgd.createStars(400, 1, 1);

	// load the Invaders scene
	loadScene(GAME.scenes.invaders);

	setCanvasFullScreen();
	run();
	repaint();
};

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