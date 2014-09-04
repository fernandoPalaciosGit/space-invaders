var SoundPool = function ( poolSize ){
	// poolSize : max sounds allowed in the pool
	this.currSound = 0;  // actual playing sound

	this.pool = [];

	// select the pool sound
	this.initPool = function ( typePool, volumePool, looping){
		var urlSound = '';
		
		switch( typePool ){
			case 'laser' :
				urlSound = './assets/sounds/laser.mp3';
				break;
			case 'explotion' :
				urlSound = './assets/sounds/explotion.mp3';
				break;
			case 'death' :
				urlSound = './assets/sounds/deadSpaceShip.wav';
				break;
			case 'bgdGame' :
				urlSound = './assets/sounds/bgd-game-sound.mp3';
				break;
			case 'endGame' :
				urlSound = './assets/sounds/bgd-game-over.mp3';
				break;
		}

		if( urlSound !== '' ){
			for (var i = 0; i < poolSize; i++) {
				var sound = new Audio( urlSound );
				sound.volume = volumePool;
				sound.loop = looping;
				sound.load();
				this.pool[i] = sound;
			}
		}
	};

	// play currSound
	this.getSound = function (){
		if( this.pool[this.currSound].currentTime == 0 || this.pool[this.currSound].ended) {
			this.pool[this.currSound].play();
		}
		this.currSound = (this.currSound + 1) % poolSize; // wue start first currSound
	};

};