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
	var	spaceShip = GAME.player.spaceShip,
			invaders = GAME.machine.invaders;
	spaceShip.posX = (GAME.canvas.width/2) - (spaceShip.w/2);
	spaceShip.posY = GAME.canvas.height - 25;

	spaceShip.setHealth(3);
	spaceShip.setDamage(0);
	spaceShip.multishot = 1;


	GAME.paused = true;
	GAME.score = 0;
	
	GAME.player.spaceShot.length = 0;

	// start whith one invader enemy (2 points of health)
	invaders.length = 0;
	invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 10, 10, 2) );
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
					invaders = GAME.machine.invaders,
					extraPoints = GAME.powerups.extraPoints;
					multiShots = GAME.powerups.multiShots;

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
					    	

							/* When destroy an invader decide random Benefit (Impronement).
							10 for out of 20, nothing happens.
							of the remaning (8), 4 will be extra Score
							and only 2 will be multi-shoot*/

							var benefit = random(20); //[0, 20]
							if ( benefit < 10 ) {
								// recicle position and Dimensions of enemy destroyed
								if( benefit < 3 ){ // create multishot Asset
									GAME.powerups.multiShots.push(
										new Asset(	invaders[j].posX, invaders[j].posY,
														invaders[j].w, invaders[j].h, 1) );
									console.log('multishots', GAME.powerups.multiShots);
								} else { // create extra score Asset, and reduce one invader
									GAME.powerups.extraPoints.push(
										new Asset(	invaders[j].posX, invaders[j].posY,
														invaders[j].w, invaders[j].h, 1) );
									console.log('extraPoint', GAME.powerups.extraPoints);
								}
							} else {
								console.log(benefit + ' >= 10 : NO benefit');
							}

							// new position of enemy destroyed 
							invaders[j].posY = 0;
							invaders[j].posX = random(GAME.canvas.width/10)*10;
							invaders[j].setHealth(2);
				    		
				    		// increase level each 3 points (add one invader)
					    	if( GAME.score % 3 === 0){
					    		invaders.push( new Asset(random(GAME.canvas.width/10)*10, 0, 10, 10, 2) );
					    	}
					   }

				    }
				}


				if ( invaders[j].damage > 0 ) {
					invaders[j].damage--;
				}

				// NEW ENEMY POSITION
				invaders[j].posY += (invaders[j].h/2); //half velocity movement

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
				} 
			}

			// MOVE POWER UPS
			for (var i = 0, len = extraPoints.length; i < len; i++) {
			    extraPoints[i].posY += (extraPoints[i].h/4);

				// SPACESHIP INTERSECT EXTRASCORE
				// increase 2 point the score and reduce one invader
				// (provide NO remove all invaders)
			};

			for (var i = 0, len = multiShots.length; i < len; i++) {
			    multiShots[i].posY += (multiShots[i].h/4);

			    // SPACESHIP INTERSECT MULTISHOT
				// increment one shot, check 3 multishots is the maximun
				// rest one multishot if  the spaceship has been reduce one health point
			};

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
	   	ctx.fillText('GAME OVER', GAME.canvas.width/2, GAME.canvas.height/2);
	   	ctx.fillText('press enter to reload game', GAME.canvas.width/2, (GAME.canvas.height/2)+20);
	   }

	}else{
		var	spaceShip = GAME.player.spaceShip,
				spaceShot = GAME.player.spaceShot,
				invaders = GAME.machine.invaders,
				extraPoints = GAME.powerups.extraPoints;
				multiShots = GAME.powerups.multiShots;

		// spaceShip flashing green/red render
		if( spaceShip.damage % 2 === 0 ){
			spaceShip.fill(ctx, '#0f0')
		} else { // damaged
			spaceShip.fill(ctx, '#f00');
		}

		// spaceShot red render
		for( var i = 0, l = spaceShot.length; i <l ; i++ ){
			spaceShot[i].fill(ctx, '#f00');
		}

		// extraPoint orange render
		for( var i = 0, l = extraPoints.length; i <l ; i++ ){
			extraPoints[i].fill(ctx, '#f90');
		}

		// multishots yellow render
		for( var i = 0, l = multiShots.length; i <l ; i++ ){
			multiShots[i].fill(ctx, '#cc6');
		}

		// invaders flashing purple/red render
		for( var j = 0, l = invaders.length; j <l ; j++ ){
			if( invaders[j].damage % 2 === 0 ){
				invaders[j].fill(ctx, '#f0f');
			} else { // damaged
				invaders[j].fill(ctx, '#f00');
			}

		}

	   ctx.textAlign ='left';
		ctx.fillStyle ='#fff';
		// var showPress = GAME.keys.lastPress+' (' +GAME.keys.isPressing[ GAME.keys.lastPress ]+')';
		// ctx.fillText('Shots: '+spaceShot.length, ctx.width-45, ctx.height-5);
		ctx.fillText('Score: ' + GAME.score, 5, ctx.height-5);
		ctx.fillText('Health: '+ spaceShip.health, ctx.width-50, ctx.height-5);
	}
};

document.addEventListener('DOMContentLoaded', init, false);