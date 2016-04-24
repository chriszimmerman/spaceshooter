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
	var playerProjectiles = [];
	var enemyProjectiles = [];

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
				playerProjectiles.push(ship.shoot());
				enemyProjectiles.push(enemy.shoot());
				framesSinceLastFired = 0;
			}
		}

		playerProjectiles.forEach(function(projectile) {
			projectile.update();
		});

		playerProjectiles = playerProjectiles.filter(function(p) { return p.active; });

		enemyProjectiles.forEach(function(projectile) {
			projectile.update();
		});

		enemyProjectiles = enemyProjectiles.filter(function(p) { return p.active; });

		handleCollisions();
	}

	function draw() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		background.draw();
		ship.draw();
		enemy.draw();
		
		playerProjectiles.forEach(function(projectile) {
			projectile.draw();
		});

		enemyProjectiles.forEach(function(projectile) {
			projectile.draw();
		});
	}

	function handleCollisions() {
		playerProjectiles.forEach(function(projectile) {
			if(collides(projectile, enemy)) {
				console.log("Player hit enemy");
				enemy.active = false;
			}
		});

		enemyProjectiles.forEach(function(projectile) {
			if(collides(projectile, ship)) {
				console.log("Enemy hit player");
				ship.active = false;
			}
		});
	}

	function collides(sprite1, sprite2) {
		return sprite1.xPosition < sprite2.xPosition + sprite2.width 
			&& sprite1.xPosition + sprite1.width > sprite2.xPosition
			&& sprite1.yPosition < sprite2.yPosition + sprite2.height
			&& sprite1.yPosition + sprite1.height > sprite2.yPosition;
	}

	setInterval(function() {
		update();
		draw();
	}, 1000 / FPS);
});

requirejs.config({
	shim: {
		'game': {
			deps: ['ship', 'key', 'background', 'enemy']
		},
		'enemy': {
			deps: ['projectile']
		},
		'ship': { 
			deps: ['projectile']
		},
		'projectile': {
			deps: ['direction', 'color']
		}
	}
});
