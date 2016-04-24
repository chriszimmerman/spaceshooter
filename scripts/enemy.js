var Enemy = class {
	constructor() {
		this.active = true;
		this.moveSpeed = 5;
		this.width = 40;
		this.height = 40;
		this.xPosition = (canvasWidth / 2) - (40 / 2);
		this.yPosition = 40;

		this.draw = function() {
			context.beginPath();
			context.fillStyle = "#1cd046";
			context.rect(this.xPosition + 10, this.yPosition, 20, 40);
			context.fill();
			context.rect(this.xPosition, this.yPosition + 10, 40, 20);
			context.fill();
			context.beginPath();
			context.fillStyle = "#000000";
			context.rect(this.xPosition + 15, this.yPosition + 15, 10, 10);
			context.fill();
		};

		this.move = function() {
			this.xPosition += this.moveSpeed;
			this.clamp();
		};

		this.moveOtherDirection = function() {
				this.moveSpeed *= -1;
		}

		this.clamp = function() {
			if(this.xPosition < 0) {
				this.xPosition = 0;
				this.moveOtherDirection();
			}

			if(this.xPosition + this.width > canvasWidth) {
				this.xPosition = canvasWidth - this.width;
				this.moveOtherDirection();
			}
		};

		this.shoot = function() {
			var xOffset = 15;
			var yOffset = 20;
			return new Projectile(this.xPosition + xOffset, this.yPosition + yOffset, Direction.DOWN, Color.RED);
		}
	}
};
