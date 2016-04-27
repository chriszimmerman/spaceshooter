var Explosion = class {
	constructor(xPosition, yPosition) {
		this.explodeFrame = 20;
		this.active = true;
		this.width = 40;
		this.height = 40;
		this.xPosition = xPosition; 
		this.yPosition = yPosition;
		
		this.centerX = function() {
			return this.xPosition + (this.width / 2);
		};

		this.centerY = function() {
			return this.yPosition + (this.height / 2);
		};

		this.draw = function() {
			if(this.active && this.explodeFrame > 0) {
				context.save();
				context.globalAlpha = 0.05 * this.explodeFrame;
				context.beginPath();
				context.arc(this.centerX(), this.centerY(), this.explodeFrame, 0, 2 * Math.PI);
				context.fillStyle = "#FF0000";
				context.fill();
				context.restore();
				this.explodeFrame--;
			}

			if(this.explodeFrame <= 0) {
				this.active = false;
			}
		};
	}
};
