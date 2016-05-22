var canvas = document.getElementById("game");
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var context = canvas.getContext("2d");

require(["ship", "key", "background", "enemy", "explosion"], function(a, b, c){
	var FPS = 30;
	var game;
	var gameOver;
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

	var gameMusic; 

	function playStartScreen() {
		background = new Background();
		background.draw();
		context.font = "50px Arial";
		context.fillStyle = "#FFFFFF";
		context.fillText("Space Shooter", 35, 100);
		context.font = "30px Arial";
		context.fillStyle = "#FFFFFF";
		context.fillText("Press Up to start", 80, 140);

		var titleShip = new Ship();
		titleShip.xPosition = canvasWidth / 2 - titleShip.width / 2;
		titleShip.yPosition = canvasHeight / 2 - titleShip.height / 2;
		titleShip.draw();

		printControlInstruction("Spacebar - shoot", 80, 270);
		printControlInstruction("Left arrow - move left", 80, 300);
		printControlInstruction("Right arrow - move right", 80, 330);

		if(Key.isDown(Key.UP)) {
			clearInterval(game);
			pauseSong();
			playSong("game_music");
			initializeGame();
		}
	}

	function printControlInstruction(text, xPosition, yPosition) {
		context.font = "20px Arial";
		context.fillStyle = "#FFFFFF";
		context.fillText(text, xPosition, yPosition);
	}

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
		updateShip();
		updateEnemy();
		playerProjectiles = updateProjectiles(playerProjectiles);
		enemyProjectiles = updateProjectiles(enemyProjectiles);
		handleCollisions();
		explosions = updateExplosions(explosions);
		checkForGameRestart();
	}

	function updateShip() {
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
	}

	function updateEnemy() {
		if(enemy.active){
			enemy.move();

			if(framesSinceEnemyLastFired > enemyFireThreshold) {
				enemyProjectiles.push(enemy.shoot());
				enemyFireThreshold = getRandomNumber(minEnemyWaitTime, maxEnemyWaitTime);
				framesSinceEnemyLastFired = 0;
			}

			framesSinceEnemyLastFired++;
		}
	}

	function updateProjectiles(projectiles) {
		projectiles.forEach(function(projectile) {
			projectile.update();
		});

		return projectiles.filter(function(p) { return p.active; });
	}

	function playSoundEffect(soundEffectName) {
			var sound = new Audio("sounds/" + soundEffectName + ".wav");
			sound.play();
	}

	function handleCollisions() {
		playerProjectiles.forEach(function(projectile) {
			if(collides(projectile, enemy)) {
				enemy.active = false;
				projectile.active = false;
				playSoundEffect("enemy_explode");
				explosions.push(new Explosion(enemy.xPosition, enemy.yPosition));
				score++;
				enemy = new Enemy();
			}
		});

		enemyProjectiles.forEach(function(projectile) {
			if(collides(projectile, ship) && ship.active) {
				ship.active = false;
				playSoundEffect("ship_explode");
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

	function updateExplosions(explosions) {
		return explosions.filter(function(e) { return e.active; });
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

	function playSong(songName) {
		gameMusic = new Audio("sounds/" + songName + ".wav");
		gameMusic.loop = true;
		gameMusic.play();
	}

	function pauseSong() {
		gameMusic.pause();
	}

	game = setInterval(function() {
		playStartScreen();
	}, 1000 / FPS);

	playSong("title_music");
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
