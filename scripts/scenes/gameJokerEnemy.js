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
				this.deathSpeceCraft( GAME.scenes.invaders );
			
			} else if ( GAME.score > 200 ) {
				loadScene(GAME.scenes.invaders);

			} else {
				this.spaceMovements();

				// move horizontal position
				joker.posX += ( joker.dir * ( joker.w/15 ) );

				// change joker direction
				if(	(joker.posX + joker.w) > GAME.canvas.width ||
						(joker.posX < 0) ){
					joker.dir *= -1;
				}




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
			
			// ENEMY RENDER
			joker.drawImageArea(ctx, GAME.sprite, 590, 490, 130, 130, '#f00');		
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