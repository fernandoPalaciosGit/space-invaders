var resizeBuffer = function (w, h){
	GAME.canvas.width = w;
	GAME.canvas.height = h;
	GAME.ctx.width = GAME.canvas.width;
	GAME.ctx.height = GAME.canvas.height;
};

var	requestAnimFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){ window.setTimeout(callback,17); };

var setCanvasFullScreen = function (){
	var c = GAME.canvas;
	//escala adecuada dependiendo de las dimensiones del canvas
	var	w = window.innerWidth / c.width,
			h = window.innerHeight / c.height,
			scale = Math.min(h,w);

	// asignar ancho y alto a nuestro canvas f/ de la escala
	c.style.width = (c.width*scale)+'px';
   c.style.height = (c.height*scale)+'px';

   // centramos el canvas y lo posicionanamos en fixed
	c.style.position = 'fixed';
	c.style.left = '50%';
	c.style.top = '50%';
	c.style.marginLeft =- (c.width*scale)/2+'px';
	c.style.marginTop =- (c.height*scale)/2+'px';
};

var random = function (max){
	// Math floor
	return ~~(Math.random()*max);
}