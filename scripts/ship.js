var Ship = class {
	constructor(canvasWidth, canvasHeight, context) {
		this.context = context;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.moveSpeed = 5;
		this.width = 40;
		this.height = 40;
		this.xPosition = (canvasWidth / 2) - (40 / 2);
		this.yPosition = 320;

		this.draw = function() {
			this.context.beginPath();
			this.context.fillStyle = "#ff8d00";
			this.context.rect(this.xPosition + 15, this.yPosition, 10, 40);
			this.context.fill();
			this.context.rect(this.xPosition, this.yPosition + 15, 40, 20);
			this.context.fill();
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
		};

		this.shoot = function() {
			return new Projectile(this.xPosition, this.yPosition, this.canvasWidth, this.canvasHeight, this.context);
		}
	}
};
