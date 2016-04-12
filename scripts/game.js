requirejs(["ship", "key", "background"], function(a, b, c){
	var canvas = document.getElementById("game");
	var canvasWidth = canvas.getAttribute("width");
	var canvasHeight = canvas.getAttribute("height");
	var context = canvas.getContext("2d");
	var FPS = 30;

	var ship = new Ship(canvasWidth, canvasHeight, context);
	var background = new Background(canvasWidth, canvasHeight, context);

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
	}

	function draw() {
		context.clearRect(0, 0, canvasWidth, canvasHeight);
		background.draw();
		ship.draw();
	}

	setInterval(function() {
		update();
		draw();
	}, 1000 / FPS);
});
