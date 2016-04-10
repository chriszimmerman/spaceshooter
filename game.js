var canvas = document.getElementById("game");
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var context = canvas.getContext("2d");
var FPS = 30;

var ship = { 
	moveSpeed: 5,
	width: 40,
	height: 40,
	X: (canvasWidth / 2) - (40 / 2),
	Y: 320,
	draw: function() {
		context.beginPath();
		context.fillStyle = "#ff8d00";
		context.rect(this.X + 15, this.Y, 10, 40);
		context.fill();
		context.rect(this.X, this.Y + 15, 40, 20);
		context.fill();
	},
	moveRight: function() {
		this.X += this.moveSpeed;
	},
	moveLeft: function() {
		this.X -= this.moveSpeed;
	},
	moveUp: function() {
		this.Y -= this.moveSpeed;
	},
	moveDown: function() {
		this.Y += this.moveSpeed;
	},
	clamp: function() {
		if(this.X < 0) {
			this.X = 0;
		}
		if(this.X + this.width > canvasWidth) {
			this.X = canvasWidth - this.width;
		}
		if(this.Y < 0) {
			this.Y = 0;
		}
		if(this.Y + this.height > canvasHeight) {
			this.Y = canvasHeight - this.height;
		}
	}
};

function drawBackground() {
	context.beginPath();
	context.rect(0, 0, canvasWidth, canvasHeight);
	context.fillStyle = "#000";
	context.fill();
}

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
	drawBackground();
	ship.draw();
}

setInterval(function() {
	update();
	draw();
}, 1000 / FPS);

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
