var Projectile = class {
	constructor(xPosition, yPosition) {
		this.active = true;

		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.xVelocity = 0;
		this.yVelocity = -5;
		this.width = 10;
		this.height = 10;
		this.color = "#FFF";

		this.inBounds = function() {
			return this.xPosition >= 0 && this.xPosition <= canvasWidth &&
				this.yPosition >= 0 && this.yPosition <= canvasHeight;
		};

		this.draw = function() {
			context.fillStyle = this.color;
			context.fillRect(this.xPosition, this.yPosition, this.width, this.height);
		};

		this.update = function() {
			this.xPosition += this.xVelocity;
			this.yPosition += this.yVelocity;

			this.active = this.active && this.inBounds();
		};
	}
}
