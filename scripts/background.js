var Background = class {
	constructor(canvasWidth, canvasHeight, context) {
		this.context = context;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.draw = function() {
			context.beginPath();
			context.rect(0, 0, this.canvasWidth, this.canvasHeight);
			context.fillStyle = "#000";
			context.fill();
		}
	}
};
