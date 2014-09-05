// constructor that implements methods to reuse all the scenes
// (prototypal inheritance or builders)
var SpaceRules = function( rules ){
	var	spaceShip = GAME.player.spaceShip,
	spaceShot       = GAME.player.spaceShot,
	invaders        = GAME.machine.invaders,
	extraPoints     = GAME.powerups.extraPoints,
	multiShots      = GAME.powerups.multiShots,
	messages        = GAME.powerups.messages,
	extraHealth     = GAME.powerups.extraHealth;
	
	// use scene settings
	this.spaceLoadSettings = function(){
		spaceShip.posX = (GAME.canvas.width/2) - (spaceShip.w/2);
		spaceShip.posY = GAME.canvas.height - spaceShip.h - 15;

		spaceShip.setDamage(0);
		GAME.paused = true;	
		GAME.animTimerSprite = 0;
	
		// start with no shots or powerups or messages
		multiShots.length  = 0;
		extraPoints.length = 0;
		extraHealth.length = 0;
		spaceShot.length   = 0;
		messages.length    = 0;

		// start whith three invaders enemys (2 points of health)
		invaders.length = 0;
	};

	this.isPausedGame = function(){
		if(	GAME.keys.lastPress === GAME.keys.allowed.KEY_ENTER &&
				!GAME.keys.isPressing[ GAME.keys.allowed.KEY_ENTER ]	){
			GAME.paused = !GAME.paused;
			GAME.gameover = false;
			GAME.keys.lastPress = null;
		}
	};

	this.deathSpeceCraft = function( ){
		GAME.sounds.game.pool[0].load();
		GAME.sounds.game.pool[0].pause();
		GAME.sounds.death.getSound();
		GAME.sounds.loose.pool[0].play();
	};

	this.spaceMovements = function(){

		// SPACESHIP HORIZONTAL MOVEMENT
		if ( GAME.keys.isPressing[ GAME.keys.allowed.KEY_RIGHT ] ){
			spaceShip.posX += (spaceShip.w/2);
		} else if ( GAME.keys.isPressing[ GAME.keys.allowed.KEY_LEFT ] ){
			spaceShip.posX -= (spaceShip.w/2);
		}

		// SPACESHIP LIMIT HORIZONTAL POSITION
		if( (spaceShip.posX + spaceShip.w) > GAME.canvas.width ){
			spaceShip.posX = GAME.canvas.width - spaceShip.w;
		} else if (spaceShip.posX < 0){
			spaceShip.posX = 0;
		}

		// SHOOTS (in front of spaceship)
		if (	GAME.keys.lastPress === GAME.keys.allowed.KEY_SPACE) {
			var	shotDim = 5,
					shotPosX = spaceShip.posX + (spaceShip.w/2) - (shotDim/2),
					shotPosY = spaceShip.posY,
					multi = spaceShip.multishot,
					way = 1;

			// implement multishot
			while( multi ){
				spaceShot.push( new Asset( shotPosX, shotPosY, shotDim, shotDim) );
				shotPosX = shotPosX + ( shotDim  * way);
				way = -1 * (way * 2);
				multi--;
			}
			
			GAME.sounds.laser.getSound();
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

		// move stars background
		for( var i=0 , len = Bgd.stars.length; i < len ; i++){
			Bgd.stars[i].posY++;

			if( Bgd.stars[i].posY > GAME.canvasBgd.height ){
				Bgd.stars[i].posX = random(GAME.canvasBgd.width);
				Bgd.stars[i].posY = 0;
			}
		}

		// cada iteracion de movimiento, resetear el contador de animate Sprite
		GAME.animTimerSprite++;
		if( GAME.animTimerSprite > 360 ){
			GAME.animTimerSprite -= 360;
		} 

		// allow an immunity of 20 loops while the player is damaged
		if( spaceShip.damage > 0 ){
			spaceShip.damage--;
		}

		// FINNISH GAME
		if( spaceShip.health < 1){
			GAME.gameover = true;
		}
	};

	this.spaceRender = function(ctx, ctxBgd){
		GAME.sounds.loose.pool[0].pause();
		GAME.sounds.game.pool[0].play();

		// transparent backgrounds
		ctxBgd.fillStyle = 'rgba(0, 0, 0, 0.3)';
		ctxBgd.fillRect(0, 0, GAME.canvasBgd.width, GAME.canvasBgd.height);

		// draw background movement canvas
		Bgd.cosmos.drawBgdCanvas(ctx, GAME.bdgCanvas, 'rgba(255, 255, 255, 0.0)');

		// spaceShip flashing sprite render
		if( spaceShip.damage % 2 === 0 ){
			// animate spaship with vertical position (posSprite = 170)
			spaceShip.drawImageArea(ctx, GAME.sprite, 118, 170+(GAME.animTimerSprite%2)*5, 100, 100, '#0f0');
		}

		// spaceShot sprite render
		for( var i = 0, l = spaceShot.length; i < l ; i++ ){
			spaceShot[i].drawImageArea(ctx, GAME.sprite, 375, 695, 25, 25, '#f00');
		}


		// flashing stars
		for(var i=0, len = Bgd.stars.length ; i < len ; i++){
			Bgd.stars[i].flashing( ctxBgd );
		}

		ctx.fillStyle = '#fff';
		ctx.fillText('Score: ' + GAME.score, 5, ctx.height-5);
		ctx.fillText('Health: '+ spaceShip.health, ctx.width-50, ctx.height-5);
	};

	this.paintPausedGame = function ( ctx, msgStage, msgPaused ){
		ctx.textAlign = 'center';
		if( !GAME.gameover ){
			ctx.fillStyle ='#0f0';
			ctx.fillText( msgStage, GAME.canvas.width/2, GAME.canvas.height/2-20);
			ctx.fillText( msgPaused , GAME.canvas.width/2, GAME.canvas.height/2);
			ctx.fillText('press enter to play', GAME.canvas.width/2, (GAME.canvas.height/2)+20);
			
			GAME.sounds.game.pool[0].pause();
		}else{
			ctx.fillStyle ='#f0f';
			ctx.fillText(	'GAME OVER', GAME.canvas.width/2, GAME.canvas.height/2);
			ctx.fillText(	'press enter to reload game',
								GAME.canvas.width/2, (GAME.canvas.height/2)+20);
		}
	};
};