require(["ship", "key", "background"], function(a, b, c){
	var canvas = document.getElementById("game");
	var canvasWidth = canvas.getAttribute("width");
	var canvasHeight = canvas.getAttribute("height");
	var context = canvas.getContext("2d");
	var FPS = 30;
	var framesSinceLastFired = 0;
	var shipFireThreshold = 5;

	var ship = new Ship(canvasWidth, canvasHeight, context);
	var background = new Background(canvasWidth, canvasHeight, context);
	var projectiles = [];

	function update() {
		if(Key.isDown(Key.RIGHT)) {
			ship.moveRight();
		}
		
		if(Key.isDown(Key.LEFT)) {
			ship.moveLeft();
		}

		if(Key.isDown(Key.UP)) {
			ship.moveUp();
		}

		if(Key.isDown(Key.DOWN)) {
			ship.moveDown();
		}
		ship.clamp();

		framesSinceLastFired++;

		if(Key.isDown(Key.SPACE)) {
			if(framesSinceLastFired > shipFireThreshold) {
				projectiles.push(ship.shoot());
				framesSinceLastFired = 0;
			}
		}

		for(var i = 0; i < projectiles.length; i++) {
			projectiles[i].update();
		}
	}

	function draw() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		background.draw();
		ship.draw();
		
		for(var i = 0; i < projectiles.length; i++) {
			projectiles[i].draw();
		}
	}

	setInterval(function() {
		update();
		draw();
	}, 1000 / FPS);
});

requirejs.config({
	shim: {
		'game': {
			deps: ['ship', 'key', 'background']
		},
		'ship': { 
			deps: ['projectile']
		}
	}
});
