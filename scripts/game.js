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
	spaceShip.posY = GAME.canvas.height - 25;


	GAME.paused = true;
	GAME.score = 0;
	
	GAME.player.health = 3;
	GAME.player.damage = 0;
	GAME.player.spaceShot.length = 0;

	// start whith onoe invader enemy
	GAME.machine.invaders.length = 0;
	GAME.machine.invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 10, 10) );
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
	// STOP MOVEMENTS
	if(	GAME.keys.lastPress === GAME.keys.allowed.KEY_ENTER &&
			!GAME.keys.isPressing[ GAME.keys.allowed.KEY_ENTER ]	){
		GAME.paused = !GAME.paused;
		GAME.gameover = false;
		GAME.keys.lastPress = null;
	}

	// MOVEMENTS NO PAUSED
	if( !GAME.paused ){

		// RELOAD FINISH WHEN NO HEALTH
		if( GAME.gameover ){
			reloadGame();

		} else {
			var	spaceShip = GAME.player.spaceShip,
					spaceShot = GAME.player.spaceShot,
					invaders = GAME.machine.invaders;

			// SPACESHIP HORIZONTAL MOVEMENT
			if ( GAME.keys.isPressing[ GAME.keys.allowed.KEY_RIGHT ] ){
				spaceShip.posX += (spaceShip.w/2);
			} else if( GAME.keys.isPressing[ GAME.keys.allowed.KEY_LEFT ] ){
				spaceShip.posX -= (spaceShip.w/2);
			}

			// SPACESHIP LIMIT HORIZONTAL POSITION
			if( spaceShip.posX > (GAME.canvas.width - spaceShip.w) ){
				spaceShip.posX = GAME.canvas.width - spaceShip.w;
			}
			if(spaceShip.posX < 0) {
				spaceShip.posX = 0;
			}

			// SHOOTS (in front of spaceship)
			if (	GAME.keys.lastPress === GAME.keys.allowed.KEY_SPACE) {
				var shotDim = 5;
				spaceShot.push(
					new Asset(
						spaceShip.posX + (spaceShip.w/2) - (shotDim/2),
						spaceShip.posY,
						shotDim, shotDim) );
				GAME.keys.lastPress = null;
			}

			// MOVE SOOTS
			for (var i = 0, len = spaceShot.length; i < len; i++) {
			    spaceShot[i].posY -= spaceShot[i].h;
			    if( spaceShot[i].posY < 0 ){
			    	spaceShot.splice( i--, 1);
			    	len--;
			    }
			}

			// MOVE ENEMIES
			for (var j = 0, long = invaders.length; j < long; j++) {
				
				// SHOT INTERSECT ENEMIES
				for (var k = 0, all = spaceShot.length; k < all; k++) {
				    if( spaceShot[k].intersect(invaders[j]) ){
				    	GAME.score++; // score increased by 1 point
				    	invaders[j].posY = 0;// recycle enemy, new position 
				    	invaders[j].posX = random(GAME.canvas.width/10)*10;
				    	if( GAME.score % 3 === 0){ // hard level each 5 points
				    		invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 10, 10) );
				    	}

				    	// destroy the intersected sohot
				    	spaceShot.splice( k--, 1 );
				    	all--;
				    }
				}

				// NEW ENEMY POSITION
				invaders[j].posY += (invaders[j].h/2); //half velocity movement

				if( invaders[j].posY > GAME.canvas.height ){ // enemy limit movement
					invaders[j].posY = 0;
					invaders[j].posX = random(GAME.canvas.width/10)*10;
				}

				if(	spaceShip.intersect(invaders[j]) && // spaceship intersect enemy
						GAME.player.damage < 1 ){ // sometimes, many invaders are together and health is affected twice or more, damage variable allow us a time winodw
					invaders[j].posY = 0;
					invaders[j].posX = random(GAME.canvas.width/10)*10;
					GAME.player.health--;
					GAME.player.damage = 20; // inmunity of 20 loops
				} 
			}

			// allow an immunity of 20 loops while the player is damaged
			if( GAME.player.damage > 0 ){
				GAME.player.damage--;
			}

			// FINNISH GAME
			if( GAME.player.health < 1){
				GAME.gameover = true;
			}

		}

	}
};

var paintCanvas = function(ctx){
 	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
	
	if( GAME.paused ){
	   ctx.textAlign = 'center';
	   if( !GAME.gameover ){
	   	ctx.fillStyle ='#0f0';
			ctx.fillText('PAUSE', GAME.canvas.width/2, GAME.canvas.height/2);
	   }else{
	   	ctx.fillStyle ='#f0f';
	   	ctx.fillText('GAME OVER', GAME.canvas.width/2, GAME.canvas.height/2);
	   }
	}else{
		var	spaceShip = GAME.player.spaceShip,
				spaceShot = GAME.player.spaceShot,
				invaders = GAME.machine.invaders;

		// pintarlo de manera intermitente
		if(GAME.player.damage % 2 === 0)
			spaceShip.fill(ctx, '#0f0')

		for( var i = 0, l = spaceShot.length; i <l ; i++ ){
			spaceShot[i].fill(ctx, '#f00');
		}

		for( var j = 0, l = invaders.length; j <l ; j++ ){
			invaders[j].fill(ctx, '#f0f');
		}

	   ctx.textAlign ='left';
		ctx.fillStyle ='#fff';
		// var showPress = GAME.keys.lastPress+' (' +GAME.keys.isPressing[ GAME.keys.lastPress ]+')';
		// ctx.fillText('Shots: '+spaceShot.length, ctx.width-45, ctx.height-5);
		ctx.fillText('Score: ' + GAME.score, 5, ctx.height-5);
		ctx.fillText('Health: '+ GAME.player.health, ctx.width-45, ctx.height-5);
	}
};

document.addEventListener('DOMContentLoaded', init, false);