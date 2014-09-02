(function(	spaceShip,
				spaceShot,
				invaders,
				extraPoints,
				multiShots,
				messages,
				extraHealth	){

var init = function (evLoad){
	document.addEventListener('keydown', onKeyPressed, false);
	document.addEventListener('keyup', offKeyPressed, false);
	window.addEventListener('resize', setCanvasFullScreen, false);

	GAME.sprite.onerror = function(event){
		this.src = 'http://www.pcengine.co.uk/sunteam/pics_unfinished/HSS_sprites.png';
		this.onerror = ""; // no more errors; ensure that the server is not fallen
	};
   GAME.sprite.src = 'assets/gameSprite.png';

	reloadGame();
	setCanvasFullScreen();
	run();
	repaint();
};

// reset game variables
var reloadGame = function (){
	spaceShip.posX = (GAME.canvas.width/2) - (spaceShip.w/2);
	spaceShip.posY = GAME.canvas.height - spaceShip.h - 15;

	spaceShip.setHealth(5);
	spaceShip.setDamage(0);
	spaceShip.multishot = 1;

	GAME.paused = true;
	GAME.score = 0;
	GAME.animTimerSprite = 0;
	
	// start with no shots or powerups or messages
	multiShots.length  = 0;
	extraPoints.length = 0;
	extraHealth.length = 0;
	spaceShot.length   = 0;
	messages.length    = 0;

	// start whith three invaders enemys (2 points of health)
	invaders.length = 0;
	invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 15, 15, 2) );
	invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 15, 15, 2) );
	invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 15, 15, 2) );
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
	window.setTimeout(run, 1000/40); //frames por segundo
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

			// MOVE MESSAGES
			for (var i = 0, len = messages.length; i < len; i++) {
				messages[i].posY -= 1;
				if( messages[i].posY < GAME.canvas.height-50 ){
					messages.splice(--i, 1);
					len--;
				}
			}

			// MOVE ENEMIES
			for (var j = 0, long = invaders.length; j < long; j++) {
				
				// SHOT INTERSECT ENEMIES
				for (var k = 0, all = spaceShot.length; k < all; k++) {
					if(	spaceShot[k].intersect(invaders[j]) &&
						invaders[j].damage < 1 ){

						// damage to invader
						invaders[j].health--;
						invaders[j].setDamage(10);

						// destroy the intersected shot
						spaceShot.splice( k--, 1 );
						all--;

						// check if invader damage is enought to destroy
						if( invaders[j].health < 1 ){
							// score increased for each invader destroyed
							GAME.score++;
							messages.push( new Message('+1', spaceShip.posX, spaceShip.posY) );


							/* When destroy an invader decide random Benefit (Impronement).
							10 for out of 20, nothing happens.
							of the remaning (8), 4 will be extra Score
							and only 2 will be multi-shoot*/

							var benefit = random(20); //[0, 20]
							if ( benefit < 10 ) {
								// recicle position and Dimensions of enemy destroyed
								if( benefit === 0 ){ // create health Asset
									extraHealth.push(
										new Asset(	invaders[j].posX, invaders[j].posY,
														invaders[j].w, invaders[j].h, 1) );

								} else if ( benefit < 3 ) { // create multishot Asset
									multiShots.push(
										new Asset(	invaders[j].posX, invaders[j].posY,
														invaders[j].w, invaders[j].h, 1) );
								
								} else { // create extra score Asset, and reduce one invader
									extraPoints.push(
										new Asset(	invaders[j].posX, invaders[j].posY,
														invaders[j].w, invaders[j].h, 1) );
								}

							} else {
								// NO BENEFIT ELSE
								// console.log(benefit + ' >= 10 : NO benefit');
							}

							// new position of enemy destroyed 
							invaders[j].posY = 0;
							invaders[j].posX = random(GAME.canvas.width/10)*10;
							invaders[j].setHealth(2);

							// increase level each 3 points (add one invader)
							if( GAME.score % 3 === 0){
								invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 15, 15, 2) );
							}
						}

					}
				}


				if ( invaders[j].damage > 0 ) {
					invaders[j].damage--;
				}

				// NEW ENEMY POSITION
				invaders[j].posY += (invaders[j].h/3); //half velocity movement

				if( invaders[j].posY > GAME.canvas.height ){ // enemy limit movement
					invaders[j].posY = 0;
					invaders[j].posX = random(GAME.canvas.width/10)*10;
				}

				if(	spaceShip.intersect(invaders[j]) && // spaceship intersect enemy
						spaceShip.damage < 1 ){ // sometimes, many invaders are together and health is affected twice or more, damage variable allow us a time winodw
					invaders[j].posY = 0;
					invaders[j].posX = random(GAME.canvas.width/10)*10;
					spaceShip.health--;
					spaceShip.setDamage(20); // inmunity of 20 loops

					// rest one multishot if  the spaceship has been reduce one health point
					if( spaceShip.multishot > 1 ){
						spaceShip.multishot--;
					}
				}
			}

			// EXTRAHEALTH POWERUPS
			for (var i = 0, len = extraHealth.length; i < len; i++) {
				//slower vertical movement
				extraHealth[i].posY += (extraHealth[i].h/4);
				
				// SPACESHIP OR CANVAS INTERSECT WITH EXTRAHEALTH
				if(	spaceShip.intersect(extraHealth[i]) || // player intersect
						extraHealth[i].posY > GAME.canvas.height ){ //vertical limit

					// increase 1 point of health
					if( spaceShip.intersect(extraHealth[i]) ){
						spaceShip.health++;
						messages.push( new Message('+UP', spaceShip.posX, spaceShip.posY) );
					}
					
					extraHealth.splice(i--, 1);
					len--;
				}
			}

			// EXTRASCORE POWERUPS
			for (var i = 0, len = extraPoints.length; i < len; i++) {
				//slower vertical movement
				extraPoints[i].posY += (extraPoints[i].h/4);
				
				// SPACESHIP OR CANVAS INTERSECT WITH EXTRASCORE
				if(	spaceShip.intersect(extraPoints[i]) || // player intersect
						extraPoints[i].posY > GAME.canvas.height ){ //vertical limit

					// increase 5 point the score
					if( spaceShip.intersect(extraPoints[i]) ){
						GAME.score += 5;
						messages.push( new Message('+5', spaceShip.posX, spaceShip.posY) );
					}
					
					extraPoints.splice(i--, 1);
					len--;
				}
			}

			// MULTISHOT POWERUPS
			for (var j = 0, long = multiShots.length; j < long; j++) {
				//slower vertical movement
				multiShots[j].posY += (multiShots[j].h/4);
				
				// SPACESHIP OR CANVAS INTERSECT WITH MULTISHOT
				if(	spaceShip.intersect(multiShots[j]) || // player intersect
						multiShots[j].posY > GAME.canvas.height ){ //vertical limit

					// increment one player shot, maximun 3 shots, rather than increment score
					if( spaceShip.intersect(multiShots[j]) ){
						if( spaceShip.multishot < 3){
							spaceShip.multishot++;
							messages.push( new Message('MULTI', spaceShip.posX, spaceShip.posY) );
						} else {
							GAME.score += 3;
							messages.push( new Message('+3', spaceShip.posX, spaceShip.posY) );
						}
					}
					
					multiShots.splice(j--, 1);
					long--;
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

var paintCanvas = function(ctx){
	ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	ctx.fillRect(0, 0, GAME.canvas.width, GAME.canvas.height);
	
	if( GAME.paused ){
		ctx.textAlign = 'center';
		if( !GAME.gameover ){
			ctx.fillStyle ='#0f0';
			ctx.fillText('PAUSE', GAME.canvas.width/2, GAME.canvas.height/2);
			ctx.fillText('press enter to play', GAME.canvas.width/2, (GAME.canvas.height/2)+20);
		}else{
			ctx.fillStyle ='#f0f';
			ctx.fillText(	'GAME OVER', GAME.canvas.width/2, GAME.canvas.height/2);
			ctx.fillText(	'press enter to reload game',
								GAME.canvas.width/2, (GAME.canvas.height/2)+20);
		}

	}else{

		// spaceShip flashing sprite render
		if( spaceShip.damage % 2 === 0 ){
			// animate spaship with vertical position (posSprite = 170)
			spaceShip.drawImageArea(ctx, GAME.sprite, 118, 170+(GAME.animTimerSprite%2)*5, 100, 100, '#0f0');
		}

		// spaceShot sprite render
		for( var i = 0, l = spaceShot.length; i < l ; i++ ){
			spaceShot[i].drawImageArea(ctx, GAME.sprite, 375, 695, 25, 25, '#f00');
		}

		// extraPoint sprite render
		for( var i = 0, l = extraPoints.length; i < l ; i++ ){
			extraPoints[i].drawImageArea(ctx, GAME.sprite, 245, 400, 75, 75, '#f90');
		}

		// multishots sprite render
		for( var i = 0, l = multiShots.length; i < l ; i++ ){
			multiShots[i].drawImageArea(ctx, GAME.sprite, 650, 640, 70, 70, '#cc6');
		}

		// extra health sprite render
		for( var i = 0, l = extraHealth.length; i < l ; i++ ){
			extraHealth[i].drawImageArea(ctx, GAME.sprite, 140, 318, 60, 60, '#0f0');
		}

		// invaders flashing sprite render
		for( var j = 0, l = invaders.length; j <l ; j++ ){
			if( invaders[j].damage % 4 === 0 ){
				invaders[j].drawImageArea(ctx, GAME.sprite, 133,510, 70, 70, '#f0f');
			} else { // damaged
				invaders[j].drawImageArea(ctx, GAME.sprite, 133, 430, 70, 70, '#f00');		
			}
		}

		// messages game benefits
		for (var j = 0, len = messages.length; j < len; j++) {
			ctx.fillStyle ='#fff';
			ctx.fillText( messages[j].msg, messages[j].posX, messages[j].posY);
		}
		

		ctx.fillStyle ='#fff';
		// var showPress = GAME.keys.lastPress+' (' +GAME.keys.isPressing[ GAME.keys.lastPress ]+')';
		// ctx.fillText('Pressing: '+showPress, ctx.width-45, ctx.height-5);
		ctx.fillText('Score: ' + GAME.score, 5, ctx.height-5);
		ctx.fillText('Health: '+ spaceShip.health, ctx.width-50, ctx.height-5);
	}
};

document.addEventListener('DOMContentLoaded', init, false);

}( GAME.player.spaceShip,
	GAME.player.spaceShot,
	GAME.machine.invaders,
	GAME.powerups.extraPoints,
	GAME.powerups.multiShots,
	GAME.powerups.messages,
	GAME.powerups.extraHealth	));