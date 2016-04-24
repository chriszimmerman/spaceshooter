var canvas = document.getElementById("game");
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var context = canvas.getContext("2d");

require(["ship", "key", "background", "enemy"], function(a, b, c){
	var FPS = 30;
	var framesSinceLastFired = 0;
	var shipFireThreshold = 5;

	var ship = new Ship();
	var enemy = new Enemy();
	var background = new Background();
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
		enemy.move();

		framesSinceLastFired++;

		if(Key.isDown(Key.SPACE)) {
			if(framesSinceLastFired > shipFireThreshold) {
				projectiles.push(ship.shoot());
				projectiles.push(enemy.shoot());
				framesSinceLastFired = 0;
			}
		}

		projectiles.forEach(function(projectile) {
			projectile.update();
		});

		projectiles = projectiles.filter(function(p) { return p.active; });
	}

	function draw() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		background.draw();
		ship.draw();
		enemy.draw();
		
		projectiles.forEach(function(projectile) {
			projectile.draw();
		});
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
