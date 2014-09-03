(function(	spaceShip,
				spaceShot,
				invaders,
				extraPoints,
				multiShots,
				messages,
				extraHealth	){

	GAME.scenes.jokerEnemy.load = function(){
		this.spaceLoadSettings();
		
		// maintain initila spaceship life
		if( spaceShip.health < 5 ){
			spaceShip.setHealth(5);
		}
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
				this.spaceMovements();

				// ENEMY MOVEMENT
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
				ctx.fillText('STAGE 2', GAME.canvas.width/2, GAME.canvas.height/2-20);
				ctx.fillText('DESTROY THE JOCKER', GAME.canvas.width/2, GAME.canvas.height/2);
				ctx.fillText('press enter to play', GAME.canvas.width/2, (GAME.canvas.height/2)+20);
			}else{
				ctx.fillStyle ='#f0f';
				ctx.fillText(	'GAME OVER', GAME.canvas.width/2, GAME.canvas.height/2);
				ctx.fillText(	'press enter to reload game',
									GAME.canvas.width/2, (GAME.canvas.height/2)+20);
			}

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