(function(	spaceShip,
				spaceShot,
				invaders,
				extraPoints,
				multiShots,
				messages,
				extraHealth	){

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
				this.deathSpeceCraft();
			
			} else if ( GAME.score > 200 ) {
				loadScene(GAME.scenes.invaders);

			} else {
				this.spaceMovements();

				// ENEMY MOVEMENT
			}
		}
	};

	GAME.scenes.jokerEnemy.paint = function( ctx, ctxBgd ){
		ctx.fillStyle = 'rgba(0, 0, 0, 0.0)'; // transparent backgrounds
		ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
		
		if( GAME.paused ){
			this.paintPausedGame( ctx, 'STAGE 2', 'DESTROY THE JOCKER');

		}else{
			this.spaceRender(ctx, ctxBgd);
			
			// ENEMY

		}
	};

}( GAME.player.spaceShip,
	GAME.player.spaceShot,
	GAME.machine.invaders,
	GAME.powerups.extraPoints,
	GAME.powerups.multiShots,
	GAME.powerups.messages,
	GAME.powerups.extraHealth	));