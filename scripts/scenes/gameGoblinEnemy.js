//////////////////
// goblin ENEMY: 
// top horizontal movement, burst shooting
//////////////////
(function(	spaceShip,
				spaceShot,
				goblin,
				goblinShot,
				goblinTimer,
				goblinHard	){

	GAME.scenes.greenGoblin.load = function(){
		this.spaceLoadSettings();
		
		// maintain initila spaceship life
		if( spaceShip.health < 5 ){
			spaceShip.setHealth(5);
		}

		goblin.health = 50;
		goblinShot.length = 0;
		goblinHard.move = 7;
		goblinHard.shot = 30;
	};

	GAME.scenes.greenGoblin.act = function(){
		// CHECK PLAYER IS PAUSING GAME
		this.isPausedGame();

		// MOVEMENTS NO PAUSED
		if( !GAME.paused ){
			
			// RELOAD INVADERS FIRST SCENE
			if( GAME.gameover){
				this.deathSpeceCraft( );
				loadScene( GAME.scenes.invaders );
			
			} else if( goblin.health < 1 ){
				GAME.player.winner = true;
			} else {
				this.spaceMovements();

				// select hardness level
				if ( goblin.health < 25 ) {
					goblinHard.move = 5;
					goblinHard.shot = 10;
				} else if ( goblin.health < 15 ){
					goblinHard.move = 4;
					goblinHard.shot = 4;
				}

				// ENEMY HORIZONTAL MOVEMENT


				// GENERATE SHOOTS (random shooter)
				goblinTimer--;
				if( goblinTimer < 0 ){
					var	shotDim = 5,
							shotPosX = goblin.posX + (goblin.w/2) - (shotDim/2),
							shotPosY = goblin.posY + goblin.h;
					goblinShot.push( new Asset( shotPosX, shotPosY, shotDim, shotDim) );
					goblinTimer = 10 + random( goblinHard.shot );
				}

				// MOVE goblin SHOOTS
				for (var i = 0, len = goblinShot.length; i < len; i++) {
					goblinShot[i].posY += 5;

				    // COLLISION
					if(	goblinShot[i].intersect(spaceShip) &&
							spaceShip.damage < 1 ){
				    	spaceShip.health--;
						spaceShip.setDamage(20); // inmunity of 20 loops

						// rest one multishot if  the spaceship has been reduce one health point
						if( spaceShip.multishot > 1 ){
							spaceShip.multishot--;
						}

						goblinShot.splice(i, 1);
						len--;
					   
					 // remove shots outside canvas
					} else if ( goblinShot[i].posY > GAME.canvas.height ){
				    	goblinShot.splice(i, 1);
						len--;
					}
				}

				// MOVE SPACECRAFT SHOTS
				for (var k = 0, all = spaceShot.length; k < all; k++) {
						if(	spaceShot[k].intersect( goblin ) &&
							goblin.damage < 1 ){

						// damage to invader
						goblin.health--;
						goblin.setDamage(10);
						GAME.score += 5;
					}
				}

				if ( goblin.damage > 0 ) {
						goblin.damage--;
				}

			} //EXIT MOVEMENTS no paused


		}
	}

	GAME.scenes.greenGoblin.paint = function( ctx, ctxBgd ){
		ctx.fillStyle = 'rgba(0, 0, 0, 0.0)'; // transparent backgrounds
		ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
		
		if( GAME.paused ){
			this.paintPausedGame( ctx, 'STAGE 3', 'DESTROY THE GREEN GOBLIN');

		}else{
			this.spaceRender(ctx, ctxBgd);
			
			// ENEMY RENDER
			ctx.fillStyle = '#fff';
			ctx.fillText('Goblin Health: '+ goblin.health, 5, 10);

			// flashing image
			if( goblin.damage % 2 === 0 ){
				goblin.drawImageArea(ctx, GAME.sprite, 130, 640, 190, 130, '#f00');
			}

			// multishots sprite render
			for( var i = 0, l = goblinShot.length; i < l ; i++ ){
				goblinShot[i].drawImageArea(ctx, GAME.sprite, 650, 640, 70, 70, '#cc6');
			}
		}
	};

}( GAME.player.spaceShip,
	GAME.player.spaceShot,
	GAME.machine.goblin.asset,
	GAME.machine.goblin.spaceShot,
	GAME.machine.goblin.shooterTimer,
	GAME.machine.goblin.hardness	));