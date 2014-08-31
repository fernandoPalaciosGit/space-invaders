var init = function (evLoad){
	document.addEventListener('keydown', onKeyPressed, false);
	document.addEventListener('keyup', offKeyPressed, false);
	window.addEventListener('resize', setCanvasFullScreen, false);

	reloadGame();
	setCanvasFullScreen();
	run();
	repaint();
};

// reset game variables
var reloadGame = function (){
	var spaceShip = GAME.player.spaceShip;
	spaceShip.posX = (GAME.canvas.width/2) - (spaceShip.w/2);
	spaceShip.posY = GAME.canvas.height - 30;
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

var run = function (){
	window.setTimeout(run, 1000/50); //frames por segundo
	moveAsset();	
};

var repaint = function (){
	requestAnimFrame(repaint);
	resizeBuffer(350, 500);
	paintCanvas(GAME.ctx);
};

var moveAsset = function (){
	// pausar movmiento
	if( GAME.keys.lastPress == GAME.keys.allowed.KEY_ENTER
			&& !GAME.keys.isPressing[ GAME.keys.allowed.KEY_ENTER ]){
		GAME.paused = !GAME.paused;
		GAME.keys.lastPress = null;
	}

	if( !GAME.paused ){
		var spaceShip = GAME.player.spaceShip;
		// Movimientos del asset
		if ( GAME.keys.isPressing[ GAME.keys.allowed.KEY_RIGHT ] ){
			spaceShip.posX += spaceShip.w;
		} else if( GAME.keys.isPressing[ GAME.keys.allowed.KEY_LEFT ] ){
			spaceShip.posX -= spaceShip.w;
		}

		// fuera del lienzo
		if( spaceShip.posX > (GAME.canvas.width - spaceShip.w) )
			spaceShip.posX = GAME.canvas.width - spaceShip.w;
		if(spaceShip.posX < 0)
			spaceShip.posX = 0;
	}
};

var paintCanvas = function(ctx){
 	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
	
	if( GAME.paused ){
	   ctx.textAlign = 'center';
	   ctx.fillStyle ='#0f0';
		ctx.fillText('PAUSE', GAME.canvas.width/2, GAME.canvas.height/2);
	}else{
		var spaceShip = GAME.player.spaceShip;
	   ctx.textAlign ='left';

		ctx.fillStyle = '#0f0';
		ctx.fillRect( spaceShip.posX, spaceShip.posY, spaceShip.w, spaceShip.h );
		
		ctx.fillStyle ='#fff';
		// var showPress = GAME.keys.lastPress+' (' +GAME.keys.isPressing[ GAME.keys.lastPress ]+')';
		ctx.fillText('Score: ' + GAME.score, 5, ctx.height-5);
	}
};

document.addEventListener('DOMContentLoaded', init, false);