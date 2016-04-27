var canvas = document.getElementById("game");
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var context = canvas.getContext("2d");

require(["ship", "key", "background", "enemy"], function(a, b, c){
	var game;
	var FPS = 30;
	//var score = 0;
	
	var drawEnemyExplosion = false;
	var drawShipExplosion = false;

	var framesSinceShipLastFired = 0;
	var framesSinceEnemyLastFired = 0;
	var shipFireThreshold = 20; 
	var minEnemyWaitTime = 5;
	var maxEnemyWaitTime = 20;
	var enemyFireThreshold = getRandomNumber(minEnemyWaitTime, maxEnemyWaitTime);

	var background = new Background();
	var ship = new Ship();
	var enemy = new Enemy();
	var playerProjectiles = [];
	var enemyProjectiles = [];

	function update() {
		if(Key.isDown(Key.RIGHT)) {
			ship.moveRight();
		}
		
		if(Key.isDown(Key.LEFT)) {
			ship.moveLeft();
		}

		ship.clamp();

		if(enemy.active){
			enemy.move();
		}

		framesSinceShipLastFired++;
		framesSinceEnemyLastFired++;

		if(Key.isDown(Key.SPACE)) {
			if(framesSinceShipLastFired > shipFireThreshold) {
				playerProjectiles.push(ship.shoot());
				framesSinceShipLastFired = 0;
			}
		}
		
		if(enemy.active && framesSinceEnemyLastFired > enemyFireThreshold) {
			enemyProjectiles.push(enemy.shoot());
			enemyFireThreshold = getRandomNumber(minEnemyWaitTime, maxEnemyWaitTime);
			framesSinceEnemyLastFired = 0;
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

		if(enemy.active) {
			enemy.draw();
		}
		else {
			enemy.explode();
		}
		
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
				enemy.active = false;
				enemy.exploding = true;
			}
		});

		enemyProjectiles.forEach(function(projectile) {
			if(collides(projectile, ship)) {
				ship.active = false;
				clearInterval(game);
			}
		});
	}

	function collides(sprite1, sprite2) {
		return sprite1.xPosition < sprite2.xPosition + sprite2.width 
			&& sprite1.xPosition + sprite1.width > sprite2.xPosition
			&& sprite1.yPosition < sprite2.yPosition + sprite2.height
			&& sprite1.yPosition + sprite1.height > sprite2.yPosition;
	}

	function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	game = setInterval(function() {
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
