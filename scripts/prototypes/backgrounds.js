var Bgd = function (x, y, w, h, t){
	this.posX = x;
	this.posY = y;
	this.w = w;
	this.h = h;
	this.timer = t || 0;
};

// draw flashing stars
Bgd.prototype.flashing = function(ctx){
	// set new timer flashing (random flashing)
	this.timer += 2;
		if( this.timer > 120 ){
		this.timer -= 120;
	}

	// when we arrived at the end of flashing subtract half to avoid the abrupt change
	var c = 255 - Math.abs( 120 - this.timer);
	ctx.fillStyle = 'rgb('+c+','+c+','+c+')';
	ctx.fillRect( this.posX, this.posY, this.w, this.h );
}

// draw background canvas
Bgd.prototype.drawBgdCanvas = function(ctx, bgdCanvas, color){
	if( !!bgdCanvas.width ){ // check loaded image
		//timeout background move
		this.timer++;
      if( this.timer > 0 ) {
          this.timer -= this.h;
      }

      // draw two times background image delayed
      ctx.globalAlpha = 0.5;
		ctx.drawImage(	bgdCanvas, 0, this.timer,
							this.w, this.h);

		ctx.drawImage(	bgdCanvas, 0, this.timer + this.h,
							this.w, this.h);
		ctx.globalAlpha = 1;
		
	}else{
		ctx.fillStyle = color;
		ctx.fillRect( this.posX, this.posY, this.w, this.h );
	}
};

Bgd.createStars = function( numStars, w, h){
	for(var i = 0; i < numStars; i++){	
		this.stars.push(
			// random timer flashing for each star
			new Bgd( random(GAME.canvasBgd.width), random(GAME.canvasBgd.height), w, h, random(100) ) );
	}
};