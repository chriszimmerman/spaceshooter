var canvas = document.getElementById("game");
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var context = canvas.getContext("2d");
var FPS = 30;

var Ship = class {
	constructor(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.moveSpeed = 5;
		this.width = 40;
		this.height = 40;
		this.xPosition = (canvasWidth / 2) - (40 / 2);
		this.yPosition = 320;

		this.draw = function() {
			context.beginPath();
			context.fillStyle = "#ff8d00";
			context.rect(this.xPosition + 15, this.yPosition, 10, 40);
			context.fill();
			context.rect(this.xPosition, this.yPosition + 15, 40, 20);
			context.fill();
		};

		this.moveRight = function() {
			this.xPosition += this.moveSpeed;
		};

		this.moveLeft = function() {
			this.xPosition -= this.moveSpeed;
		};

		this.moveUp = function() {
			this.yPosition -= this.moveSpeed;
		},

		this.moveDown = function() {
			this.yPosition += this.moveSpeed;
		};

		this.clamp = function() {
			if(this.xPosition < 0) {
				this.xPosition = 0;
			}
			if(this.xPosition + this.width > this.canvasWidth) {
				this.xPosition = this.canvasWidth - this.width;
			}
			if(this.yPosition < 0) {
				this.yPosition = 0;
			}
			if(this.yPosition + this.height > this.canvasHeight) {
				this.yPosition = this.canvasHeight - this.height;
			}
		}
	}
};

var ship = new Ship(canvasWidth, canvasHeight);

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
