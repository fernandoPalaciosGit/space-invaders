var init = function (evLoad){
	document.addEventListener('keydown', onKeyPressed, false);
	document.addEventListener('keyup', offKeyPressed, false);
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

var run = function (){
	window.setTimeout(run, 1000/50); //frames por segundo
	moveAsset();	
};

var repaint = function (){
	requestAnimFrame(repaint);
	resizeBuffer();
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
		// Movimientos del asset
		if( GAME.keys.isPressing[ GAME.keys.allowed.KEY_UP ] ){
			GAME.asset.posY -= GAME.asset.h;
		} else if ( GAME.keys.isPressing[ GAME.keys.allowed.KEY_RIGHT ] ){
			GAME.asset.posX += GAME.asset.w;
		} else if ( GAME.keys.isPressing[ GAME.keys.allowed.KEY_DOWN ] ){
			GAME.asset.posY += GAME.asset.h;
		} else if( GAME.keys.isPressing[ GAME.keys.allowed.KEY_LEFT ] ){
			GAME.asset.posX -= GAME.asset.w;
		}

		// fuera del lienzo
		if( GAME.asset.posX > GAME.canvas.width )
			GAME.asset.posX = 0;
		if( GAME.asset.posY > GAME.canvas.height)
			GAME.asset.posY = 0; 
		if(GAME.asset.posX < 0)
			GAME.asset.posX = GAME.canvas.width;
		if(GAME.asset.posY < 0)
			GAME.asset.posY = GAME.canvas.height;
	}
};

var paintCanvas = function(ctx){
 	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
	
	if( GAME.paused ){
	   ctx.textAlign = 'center';
	   ctx.fillStyle='#0f0';
		ctx.fillText('PAUSE', 150, 75);
	}else{
	   ctx.textAlign='left';

		ctx.fillStyle = '#0f0';
		ctx.fillRect( GAME.asset.posX, GAME.asset.posY, GAME.asset.w, GAME.asset.h );
		
		ctx.fillStyle='#fff';
		var showPress = GAME.keys.lastPress + ' (' + GAME.keys.isPressing[ GAME.keys.lastPress ]+')';
		ctx.fillText('Last Press: ' + showPress, 10, 20);
	}
};

var resizeBuffer = function (){
	GAME.canvas.width = 300;
	GAME.canvas.height = 500;
	GAME.ctx.width = GAME.canvas.width;
	GAME.ctx.height = GAME.canvas.height;
};

var	requestAnimFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){ window.setTimeout(callback,17); };

document.addEventListener('DOMContentLoaded', init, false);