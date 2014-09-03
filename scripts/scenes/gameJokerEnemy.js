(function(	spaceShip,
				spaceShot,
				invaders,
				extraPoints,
				multiShots,
				messages,
				extraHealth	){

	GAME.scenes.jokerEnemy.load = function(){
		spaceShip.posX = (GAME.canvas.width/2) - (spaceShip.w/2);
		spaceShip.posY = GAME.canvas.height - spaceShip.h - 15;

		// maintain initila spaceship life
		if( spaceShip.health < 5 ){
			spaceShip.setHealth(5);
		}
		
		spaceShip.setDamage(0);
		GAME.paused = true;

		// start with no shots or powerups or messages
		multiShots.length  = 0;
		extraPoints.length = 0;
		extraHealth.length = 0;
		spaceShot.length   = 0;
		messages.length    = 0;

		// delete all invders yet
		invaders.length = 0;
	};

	GAME.scenes.jokerEnemy.act = function(){
		// STOP MOVEMENTS
		if(	GAME.keys.lastPress === GAME.keys.allowed.KEY_ENTER &&
				!GAME.keys.isPressing[ GAME.keys.allowed.KEY_ENTER ]	){
			GAME.paused = !GAME.paused;
			GAME.gameover = false;
			GAME.keys.lastPress = null;
		}

		// MOVEMENTS NO PAUSED
		if( !GAME.paused ){
			// RELOAD INVADERS FIRST SCENE
			if( GAME.gameover || GAME.score > 200){ // check if player win the boss
				loadScene(GAME.scenes.invaders);
			} else {
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

				// ENEMY MOVEMENT


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
			}
		}
	};

	GAME.scenes.jokerEnemy.paint = function( ctx, ctxBgd ){
		ctx.fillStyle = 'rgba(0, 0, 0, 0.0)'; // transparent backgrounds
		ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
		
		if( GAME.paused ){

			ctx.textAlign = 'center';
			if( !GAME.gameover ){
				ctx.fillStyle ='#0f0';
				ctx.fillText('DESTROY THE JOCKER', GAME.canvas.width/2, GAME.canvas.height/2);
				ctx.fillText('press enter to play', GAME.canvas.width/2, (GAME.canvas.height/2)+20);
			}else{
				ctx.fillStyle ='#f0f';
				ctx.fillText(	'GAME OVER', GAME.canvas.width/2, GAME.canvas.height/2);
				ctx.fillText(	'press enter to reload game',
									GAME.canvas.width/2, (GAME.canvas.height/2)+20);
			}

		}else{
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

			// ENEMY

			// flashing stars
			for(var i=0, len = Bgd.stars.length ; i < len ; i++){
				Bgd.stars[i].flashing( ctxBgd );
			}

			ctx.fillStyle ='#fff';
			ctx.fillText('Score: ' + GAME.score, 5, ctx.height-5);
			ctx.fillText('Health: '+ spaceShip.health, ctx.width-50, ctx.height-5);
		}

	};

}( GAME.player.spaceShip,
	GAME.player.spaceShot,
	GAME.machine.invaders,
	GAME.powerups.extraPoints,
	GAME.powerups.multiShots,
	GAME.powerups.messages,
	GAME.powerups.extraHealth	));