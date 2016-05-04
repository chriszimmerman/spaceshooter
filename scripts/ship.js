var Ship = class {
	constructor() {
		this.active = true;
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
			if(this.xPosition + this.width > canvasWidth) {
				this.xPosition = canvasWidth - this.width;
			}
			if(this.yPosition < 0) {
				this.yPosition = 0;
			}
			if(this.yPosition + this.height > canvasHeight) {
				this.yPosition = canvasHeight - this.height;
			}
		};

		this.shoot = function() {
			var sound = new Audio("sounds/ship_fire.wav");
			sound.play();

			var xOffset = 15;
			return new Projectile(this.xPosition + xOffset, this.yPosition, Direction.UP, Color.WHITE);
		}
	}
};
