var Asset = function (x, y, w, h, hh){
	this.posX = x || 0;
	this.posY = y || 0;
	this.w  = w || 0;
	this.h = h || this.w;
	this.health = hh || 3;
	this.damage = 0;

	this.setHealth = function(h){
		this.health = h;
	};

	this.setDamage = function(d){
		this.damage = d;
	};
};

// additional player and machine properties
Asset.prototype.fill = function(ctx, color){
	ctx.fillStyle = color;
	ctx.fillRect(this.posX, this.posY, this.w, this.h);
};

// Assets collisions
Asset.prototype.intersect = function(asset){
	// this.constructor.prototype.isPrototypeOf(asset)
	if( asset instanceof this.constructor ){
		return	this.posX < (asset.posX + asset.w) &&
					(this.posX + this.w) > asset.posX &&
					this.posY < (asset.posY + asset.h) &&
					(this.posY + this.h) > asset.posY;
	}
};

// draw sprite Assets
Asset.prototype.drawImageArea = function (ctx, sprite, cutPosX, cutPosY, cutWidth, cutHeight, color){
	// check if the sprite image is loaded
	if( !!sprite.width ){
		ctx.drawImage(	sprite,
					cutPosX, cutPosY, cutWidth, cutHeight,   //cut the sprite image
					this.posX, this.posY,	//position the image inside the asset
					this.w, this.h );	//size the cut image in the canvas
	} else {
		this.fill(ctx, color);
	}
};

// aditional properties only for player spaceship
Asset.prototype.multishot = null;