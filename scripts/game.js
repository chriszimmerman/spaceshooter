var canvas = document.getElementById("game");
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var context = canvas.getContext("2d");

require(["ship", "key", "background", "enemy", "explosion"], function(a, b, c){
	var game;
	var gameOver;
	var FPS = 30;
	var score;
	
	var drawEnemyExplosion;
	var drawShipExplosion;

	var framesSinceShipLastFired;
	var framesSinceEnemyLastFired;
	var shipFireThreshold; 
	var minEnemyWaitTime;
	var maxEnemyWaitTime;
	var enemyFireThreshold;

	var background;
	var ship;
	var enemy;
	var playerProjectiles;
	var enemyProjectiles;
	var explosions;

	function initializeGame() {
		gameOver = false;
		score = 0;
		
		drawEnemyExplosion = false;
		drawShipExplosion = false;

		framesSinceShipLastFired = 0;
		framesSinceEnemyLastFired = 0;
		shipFireThreshold = 20; 
		minEnemyWaitTime = 5;
		maxEnemyWaitTime = 20;
		enemyFireThreshold = getRandomNumber(minEnemyWaitTime, maxEnemyWaitTime);

		background = new Background();
		ship = new Ship();
		enemy = new Enemy();
		playerProjectiles = [];
		enemyProjectiles = [];
		explosions = [];

		game = setInterval(function() {
			update();
			draw();
		}, 1000 / FPS);
	}

	function update() {
		if(ship.active) {
			if(Key.isDown(Key.RIGHT)) {
				ship.moveRight();
			}
			
			if(Key.isDown(Key.LEFT)) {
				ship.moveLeft();
			}

			if(Key.isDown(Key.SPACE)) {
				if(framesSinceShipLastFired > shipFireThreshold) {
					playerProjectiles.push(ship.shoot());
					framesSinceShipLastFired = 0;
				}
			}

			framesSinceShipLastFired++;
		}

		ship.clamp();

		if(enemy.active){
			enemy.move();

			if(framesSinceEnemyLastFired > enemyFireThreshold) {
				enemyProjectiles.push(enemy.shoot());
				enemyFireThreshold = getRandomNumber(minEnemyWaitTime, maxEnemyWaitTime);
				framesSinceEnemyLastFired = 0;
			}

			framesSinceEnemyLastFired++;
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

		explosions = explosions.filter(function(e) { return e.active; });

		checkForGameRestart();
	}

	function checkForGameRestart() {
		if(gameOver && Key.isDown(Key.UP)) {
			clearInterval(game);
			initializeGame();
		}
	}

	function draw() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		background.draw();

		if(ship.active) {
			ship.draw();
		}

		if(enemy.active) {
			enemy.draw();
		}
		
		playerProjectiles.forEach(function(projectile) {
			projectile.draw();
		});

		enemyProjectiles.forEach(function(projectile) {
			projectile.draw();
		});

		explosions.forEach(function(explosion) {
			explosion.draw();
		});

		drawScore();

		if(gameOver) {
			drawGameOver();
		}
	}

	function drawScore() {
		context.font = "30px Arial";
		context.fillStyle = "#FFFFFF";
		context.fillText("Score: " + score, 10, 30);
	}

	function drawGameOver() {
		context.font = "60px Arial";
		context.fillStyle = "#FFFFFF";
		context.fillText("GAME OVER", 20, 220);
		context.font = "30px Arial";
		context.fillStyle = "#FFFFFF";
		context.fillText("Press Up to restart", 80, 250);
	}

	function handleCollisions() {
		playerProjectiles.forEach(function(projectile) {
			if(collides(projectile, enemy)) {
				enemy.active = false;
				projectile.active = false;
				explosions.push(new Explosion(enemy.xPosition, enemy.yPosition));
				score++;
				enemy = new Enemy();
			}
		});

		enemyProjectiles.forEach(function(projectile) {
			if(collides(projectile, ship) && ship.active) {
				ship.active = false;
				explosions.push(new Explosion(ship.xPosition, ship.yPosition));
				gameOver = true;
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

	initializeGame();
});

requirejs.config({
	shim: {
		'game': {
			deps: ['ship', 'key', 'background', 'enemy', 'explosion']
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
