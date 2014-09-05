//////////////////
// JOKER ENEMY: 
// top horizontal movement, burst shooting
//////////////////
(function(	spaceShip,
				spaceShot,
				invaders,
				extraPoints,
				multiShots,
				messages,
				extraHealth,
				joker,
				jokerShot,
				jokerTimer	){

	GAME.scenes.jokerEnemy.load = function(){
		this.spaceLoadSettings();
		
		// adjust the score
		GAME.score = 100;
		// maintain initila spaceship life
		if( spaceShip.health < 5 ){
			spaceShip.setHealth(5);
		}

	};

	GAME.scenes.jokerEnemy.act = function(){
		// CHECK PLAYER IS PAUSING GAME
		this.isPausedGame();

		// MOVEMENTS NO PAUSED
		if( !GAME.paused ){
			
			// RELOAD INVADERS FIRST SCENE
			if( GAME.gameover){ // check if player win the boss
				this.deathSpeceCraft( );
				loadScene( GAME.scenes.invaders );
			
			} else if( joker.health < 1 ){
				/////////////////////////////////////////////
				// check another scenoe, not the first //
				/////////////////////////////////////////////
				loadScene(GAME.scenes.invaders);

			} else {
				this.spaceMovements();

				// ENEMY HORIZONTAL MOVEMENT
				joker.posX += ( joker.dir * random( joker.w/7 ) );

				// ensure asset not blocking
				if ( (joker.posX + (joker.w / 2) ) > GAME.canvas.width ) {
					joker.posX = 0;

				} else if ( (joker.posX + (joker.w / 2) ) < 0 ) {
					joker.posX = GAME.canvas.width - joker.w;

				// change joker direction
				} else if (	(joker.posX + joker.w) > GAME.canvas.width ||
								(joker.posX < 0) ){
					joker.dir *= -1;
				}

				// GENERATE SHOOTS (random shooter)
				jokerTimer--;
				if( jokerTimer < 0 ){
					var	shotDim = 5,
							shotPosX = joker.posX + (joker.w/2) - (shotDim/2),
							shotPosY = joker.posY + joker.h;
					jokerShot.push( new Asset( shotPosX, shotPosY, shotDim, shotDim) );
					jokerTimer = 10 + random(30);
				}

				// MOVE JOKER SHOOTS
				for (var i = 0, len = jokerShot.length; i < len; i++) {
					jokerShot[i].posY += 5;

				    // COLLISION
					if(	jokerShot[i].intersect(spaceShip) &&
							spaceShip.damage < 1 ){
				    	spaceShip.health--;
						spaceShip.setDamage(20); // inmunity of 20 loops

						// rest one multishot if  the spaceship has been reduce one health point
						if( spaceShip.multishot > 1 ){
							spaceShip.multishot--;
						}

						jokerShot.splice(i, 1);
						len--;
					   
					 // remove shots outside canvas
					} else if ( jokerShot[i].posY > GAME.canvas.height ){
				    	jokerShot.splice(i, 1);
						len--;
					}
				}

				// MOVE SPACECRAFT SHOTS
				// MOVE SPACECRAFT SHOTS
				for (var k = 0, all = spaceShot.length; k < all; k++) {
						if(	spaceShot[k].intersect( joker ) &&
							joker.damage < 1 ){

						// damage to invader
						joker.health--;
						joker.setDamage(10);
						GAME.score += 5;
					}
				}

				if ( joker.damage > 0 ) {
						joker.damage--;
				}

			} //EXIT MOVEMENTS no paused


		}
	}

	GAME.scenes.jokerEnemy.paint = function( ctx, ctxBgd ){
		ctx.fillStyle = 'rgba(0, 0, 0, 0.0)'; // transparent backgrounds
		ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
		
		if( GAME.paused ){
			this.paintPausedGame( ctx, 'STAGE 2', 'DESTROY THE JOCKER');

		}else{
			this.spaceRender(ctx, ctxBgd);
			
			// ENEMY RENDER
			ctx.fillStyle = '#fff';
			ctx.fillText('Joker Health: '+ joker.health, 5, 10);

			// flashing image
			if( joker.damage % 2 === 0 ){
				joker.drawImageArea(ctx, GAME.sprite, 590, 490, 130, 130, '#f00');
			}


			// multishots sprite render
			for( var i = 0, l = jokerShot.length; i < l ; i++ ){
				jokerShot[i].drawImageArea(ctx, GAME.sprite, 650, 640, 70, 70, '#cc6');
			}
		}
	};

}( GAME.player.spaceShip,
	GAME.player.spaceShot,
	GAME.machine.invaders,
	GAME.powerups.extraPoints,
	GAME.powerups.multiShots,
	GAME.powerups.messages,
	GAME.powerups.extraHealth,
	GAME.machine.joker.asset,
	GAME.machine.joker.spaceShot,
	GAME.machine.joker.shooterTimer	));